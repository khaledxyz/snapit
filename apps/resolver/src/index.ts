import { randomBytes } from "node:crypto";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import { Pool } from "pg";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2000,
});

// Test database connection on startup
pool
  .query("SELECT NOW()")
  .then(() => console.log("✓ Database connected"))
  .catch((err) => console.error("✗ Database connection failed:", err));

// Middleware
app.use(express.json());
app.disable("x-powered-by");

// Permanent redirect root to client app
app.get("/", (_, res) => {
  const clientUrl = process.env.CLIENT_URL;
  if (!clientUrl) {
    return res.status(500).send("CLIENT_URL not set");
  }
  res.redirect(301, clientUrl);
});

// Health check
app.get("/health", async (_, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({ status: "error", database: "disconnected" });
  }
});

// Main redirect handler
app.get("/:code", async (req: Request, res: Response) => {
  const { code } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Fetch URL and validate expiration
    const urlResult = await client.query(
      `SELECT id, original_url, expires_at, password_hash 
       FROM url 
       WHERE code = $1`,
      [code]
    );

    if (urlResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).send("Short URL not found");
    }

    const url = urlResult.rows[0];

    // Check if expired
    if (url.expires_at && new Date(url.expires_at) < new Date()) {
      await client.query("ROLLBACK");
      return res.status(410).send("This short URL has expired");
    }

    // Check if password protected
    if (url.password_hash) {
      await client.query("ROLLBACK");
      return res.status(401).send("This URL is password protected");
    }

    // Track analytics - increment click count
    await client.query(
      "UPDATE url SET click_count = click_count + 1 WHERE id = $1",
      [url.id]
    );

    // Insert click analytics
    const clickId = randomBytes(16).toString("hex");
    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      null;
    const userAgent = req.headers["user-agent"] || null;
    const referer = req.headers.referer || req.headers.referrer || null;

    await client.query(
      `INSERT INTO url_click (id, url_id, ip_address, user_agent, referer, clicked_at) 
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [clickId, url.id, ipAddress, userAgent, referer]
    );

    await client.query("COMMIT");

    // Redirect to original URL
    res.redirect(301, url.original_url);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error resolving URL:", error);
    res.status(500).send("Internal server error");
  } finally {
    client.release();
  }
});

// 404 handler
app.use((_, res) => {
  res.status(404).send("Not found");
});

// Error handler
app.use((err: Error, _: Request, res: Response) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Internal server error");
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, closing server...");
  await pool.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, closing server...");
  await pool.end();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Resolver running on port ${PORT}`);
});
