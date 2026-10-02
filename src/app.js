import express from "express";
import morgan from "morgan";

import database from "./config/database.js";
import { createMySqlEntryRepository } from "./repositories/mysql-entry-repository.js";
import { createGetAllEntriesController } from "./controllers/get-all-entries-controller.js";
import { createGetRandomEntryController } from "./controllers/get-random-entry-controller.js";
import { createDeleteEntryController } from "./controllers/delete-entry-controller.js";
import { createNewEntryController } from "./controllers/create-entry-controller.js";
import { createEntryRouter } from "./routes/entry-routes.js";

const entryRepository = createMySqlEntryRepository(database);

const getAllEntriesController = createGetAllEntriesController(entryRepository);
const getRandomEntryController =
  createGetRandomEntryController(entryRepository);
const deleteEntryController = createDeleteEntryController(entryRepository);
const createEntryController = createNewEntryController(entryRepository);

const entryRouter = createEntryRouter({
  getAllEntriesController,
  getRandomEntryController,
  deleteEntryController,
  createEntryController,
});

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/entries", entryRouter);

export default app;
