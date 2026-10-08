import { entryRepo } from "../repositories/mysql-entry-repository";

export const getRandomEntryController = async (req, res) => {
  const entry = await entryRepo.getRandom();

  if (!entry) {
    return res.status(404).json({
      message: "No entries are available.",
    });
  }

  return res.status(200).json(entry);
};