// entry = 1 entry in the joy jar

import { Router } from "express";

export const createEntryRouter = ({
  getAllEntriesController,
  getRandomEntryController,
  deleteEntryController,
  createEntryController,
}) => {
  const entryRouter = Router();

  entryRouter.get("/", getAllEntriesController);
  entryRouter.get("/random", getRandomEntryController);
  entryRouter.delete("/:id", deleteEntryController);
  entryRouter.post("/", createEntryController);

  return entryRouter;
};
