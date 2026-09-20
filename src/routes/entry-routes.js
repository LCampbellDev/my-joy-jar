import { Router } from "express";
import {
  createEntry,
  deleteEntry,
  getAllEntries,
  getRandomEntry,
} from "../controllers/index.js";

// Express router for entry routes
const entryRouter = Router();

entryRouter.get("/", getAllEntries);

entryRouter.post("/", createEntry);

entryRouter.get("/random", getRandomEntry);

entryRouter.delete("/:id", deleteEntry);

export default entryRouter;
