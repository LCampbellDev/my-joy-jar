import express from "express";
import morgan from "morgan";

import database from "./config/database.js";
import { createMySqlEntryRepository } from "./repositories/mysql-entry-repository.js";
import { createGetAllEntriesController } from "./controllers/get-all-entries-controller.js";
import { createEntryRouter } from "./routes/entry-routes.js";

const entryRepository = createMySqlEntryRepository(database);

const getAllEntriesController = createGetAllEntriesController(entryRepository);

const entryRouter = createEntryRouter({
  getAllEntriesController,
});

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/entries", entryRouter);

export default app;
