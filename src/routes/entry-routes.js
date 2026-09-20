import { Router } from "express";
import { getAllEntries } from "../controllers/get-all-entries-controller.js";
import { getRandomEntry } from "../controllers/get-random-entry-controller.js";
import { createEntry } from "../controllers/create-entry-controller.js";
import { deleteEntry } from "../controllers/delete-entry-controller.js";

// Express router for entry routes
const entryRouter = Router();

entryRouter.get("/", getAllEntries);

entryRouter.post("/", createEntry);

entryRouter.get("/random", getRandomEntry);

entryRouter.delete("/:id", deleteEntry);

export default entryRouter;
