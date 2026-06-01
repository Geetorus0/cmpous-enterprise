import { defineConfig } from "drizzle-kit";
import path from "path";
import fs from "fs";

// Load .env manually if process.env.DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
  const envPaths = [
    path.join(__dirname, "../../.env"),
    path.join(__dirname, ".env"),
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const firstEqual = trimmed.indexOf("=");
          if (firstEqual !== -1) {
            const key = trimmed.slice(0, firstEqual).trim();
            const value = trimmed.slice(firstEqual + 1).trim().replace(/^['"]|['"]$/g, "");
            if (!process.env[key]) {
              process.env[key] = value;
            }
          }
        }
      }
      break;
    }
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is missing. Please ensure your .env file exists in the workspace root and contains DATABASE_URL=postgresql://...");
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
