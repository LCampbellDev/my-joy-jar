import express from "express";
import morgan from "morgan";

import { entryRoutes } from "./routes/entries";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/entries", entryRoutes());

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error('Request failed', error);

  return res.status(500).json({
    message: 'Something went wrong. Please try again later.',
  });
});

export default app;
