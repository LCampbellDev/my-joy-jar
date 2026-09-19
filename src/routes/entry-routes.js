import { Router } from "express";

import {
  getAllEntries,
  createEntry,
  getRandomEntry,
} from "../controllers/entry-controller.js";

// Express router for entry routes
const entryRouter = Router();

entryRouter.get("/", getAllEntries);

entryRouter.post("/", createEntry);

entryRouter.get("/random", getRandomEntry);

export default entryRouter;
