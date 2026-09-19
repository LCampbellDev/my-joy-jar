import { Router } from "express";

import { getAllEntries } from "../controllers/entry-controller.js";

// Express router for entry routes
const entryRouter = Router();

entryRouter.get("/", getAllEntries);

export default entryRouter;
