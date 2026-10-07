// entry = 1 entry in the joy jar
import { Router } from "express";
import { createEntryController } from "../controllers/create-entry-controller";
import { deleteEntryController } from "../controllers/delete-entry-controller";
import { getAllEntriesController } from "../controllers/get-all-entries-controller";
import { getRandomEntryController } from "../controllers/get-random-entry-controller";

export const entryRoutes = () => {
    const router = Router();

    router.get("/", getAllEntriesController);
    router.get("/random", getRandomEntryController);
    router.post("/", createEntryController);
    router.delete("/:id", deleteEntryController);

return router;
};

