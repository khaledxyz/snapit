/** biome-ignore-all lint/style/noNonNullAssertion: <not needed> */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app";
import "./index.css";

import { client } from "@snapit/sdk";

client.setConfig({
  baseUrl: import.meta.env.VITE_CLIENT_URL,
  credentials: "include",
});

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
