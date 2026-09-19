import express from "express";
import morgan from "morgan";
import entryRouter from "./routes/entry-routes.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/entries", entryRouter);

export default app;
