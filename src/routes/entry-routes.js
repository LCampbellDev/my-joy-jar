import { Router } from "express";

import {
  getAllEntries,
  createEntry,
  getRandomEntry,
  deleteEntry,
} from "../controllers/entry-controller.js";

// Express router for entry routes
const entryRouter = Router();

entryRouter.get("/", getAllEntries);

entryRouter.post("/", createEntry);

entryRouter.get("/random", getRandomEntry);

entryRouter.delete("/:id", deleteEntry);

export default entryRouter;
