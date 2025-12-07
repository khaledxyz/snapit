/** biome-ignore-all lint/style/noNonNullAssertion: <not needed> */

import { OpenAPI } from "@snapit/sdk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app";
import "./index.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const apiPrefix = import.meta.env.VITE_API_PREFIX || "/api";
OpenAPI.BASE = `${apiUrl}${apiPrefix}`;

createRoot(document.getElementById("app")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
