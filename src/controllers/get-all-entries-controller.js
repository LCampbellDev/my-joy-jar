import { entryRepo } from '../repositories/mysql-entry.repo';

export const getAllEntriesController = async (req, res) => {
  try {
    console.info('Fetching all entries');

    const entries = await entryRepo.getAll();

    return res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching all entries:", error);
    
    throw new Error(`Error fetching all entries: ${error.message}`);
  }
};

