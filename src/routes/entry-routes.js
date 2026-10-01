import { Router } from "express";

export const createEntryRouter = ({ getAllEntriesController }) => {
  const entryRouter = Router();

  entryRouter.get("/", getAllEntriesController);

  return entryRouter;
};

import {
  // createEntry,
  // deleteEntry,
  createGetAllEntriesController,
  // getRandomEntry,
} from "../controllers/index.js";

// Express router for entry routes
const entryRouter = Router();

entryRouter.get("/", createGetAllEntriesController);

// entryRouter.post("/", createEntry);

// entryRouter.get("/random", getRandomEntry);

// entryRouter.delete("/:id", deleteEntry);

export default entryRouter;
