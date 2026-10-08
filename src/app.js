import express from "express";
import morgan from "morgan";

import { entryRoutes } from "./routes/entry-routes";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/entries", entryRoutes());

export default app;
