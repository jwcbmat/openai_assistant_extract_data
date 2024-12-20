import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";

config();

import helloWorldRouter from "./routes/hello-world.route";
import webhookRouter from "./routes/webhook.route";

export default async function App() {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.use("/", helloWorldRouter);
  app.use("/", webhookRouter);

  return app;
}

