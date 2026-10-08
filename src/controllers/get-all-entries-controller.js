import { entryRepo } from '../repositories/mysql-entry-repository';

export const getAllEntriesController = async (req, res) => {
  try {
  const entries = await entryRepo.getAll();

    return res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching all entries:", error);
    return res.status(500).json({
      message: "Unable to retrieve entries.",
    });
  } 
};