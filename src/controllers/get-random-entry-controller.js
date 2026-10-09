import { entryRepo } from "../repositories/mysql-entry.repo";

/**
 * Handles GET /api/entries/random.
 * Responds with 200 and one randomly selected entry,
 * or 404 if the jar is empty.
 * Repository failures are logged and rethrown for central error middleware.
 *
 * @param {Object} req - The Express request; no request data is used.
 * @param {Object} res - The Express response used to send JSON.
 * @returns {Promise<Object>} The Express response after sending JSON.
 */
export const getRandomEntryController = async (req, res) => {
  try {
    console.info("Fetching a random entry");

    const entry = await entryRepo.getRandom();

    if (!entry) {
      return res.status(404).json({
        message: "No entries are available.",
      });
    }

    return res.status(200).json(entry);
  } catch (error) {
    console.error("Error fetching a random entry", error);

    throw new Error(`Error fetching a random entry: ${error.message}`, {
      cause: error,
    });
  }
};
