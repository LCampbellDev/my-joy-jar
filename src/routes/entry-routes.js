import { Router } from "express";

import { getAllEntries, createEntry } from "../controllers/entry-controller.js";

// Express router for entry routes
const entryRouter = Router();

entryRouter.get("/", getAllEntries);

entryRouter.post("/", createEntry);

export default entryRouter;
