import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Root route — friendly response for browser access
app.get("/", (_req, res) => {
  res.json({
    name: "AEC Campus API",
    version: "1.0.0",
    maintainer: "Geetorus",
    status: "running",
    endpoints: {
      health: "/api/healthz",
      api: "/api/*",
    },
  });
});

export default app;
