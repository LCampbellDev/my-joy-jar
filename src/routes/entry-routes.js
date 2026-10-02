import { Router } from "express";

export const createEntryRouter = ({ 
  getAllEntriesController,
  getRandomEntryController }) => {
  const entryRouter = Router();

  entryRouter.get("/", getAllEntriesController);
  entryRouter.get("/random", getRandomEntryController);


  return entryRouter;
};

