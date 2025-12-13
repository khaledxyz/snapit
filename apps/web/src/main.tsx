/** biome-ignore-all lint/style/noNonNullAssertion: <not needed> */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { client } from "@snapit/sdk";

import { App } from "./app";
import "./index.css";

const baseUrl = `${import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? ""}${import.meta.env.VITE_API_PREFIX ?? ""}`;

client.setConfig({
  baseUrl,
  credentials: "include",
});

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
