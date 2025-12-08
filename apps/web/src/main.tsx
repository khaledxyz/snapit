/** biome-ignore-all lint/style/noNonNullAssertion: <not needed> */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { setBaseURL } from "@snapit/sdk";

import { App } from "./app";
import "./index.css";

setBaseURL(import.meta.env.VITE_API_URL || "http://localhost:5000");

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
