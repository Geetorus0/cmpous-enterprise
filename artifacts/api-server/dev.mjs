/**
 * Cross-platform dev launcher for @workspace/api-server.
 * Replaces the Unix-only `export NODE_ENV=development && pnpm run build && pnpm run start`
 * shell script so it works on Windows PowerShell/CMD as well as Linux/macOS.
 */
import { execSync } from "child_process";

process.env.NODE_ENV = "development";
// Provide a default port so the server starts locally without a .env file
if (!process.env.PORT) process.env.PORT = "3000";

const opts = { stdio: "inherit", shell: true, env: process.env };

console.log("[dev] Building api-server...");
execSync("pnpm run build", opts);

console.log("[dev] Starting api-server on port " + process.env.PORT + "...");
execSync("pnpm run start", opts);
