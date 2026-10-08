import { entryRepo } from '../repositories/mysql-entry.repo';

export const getRandomEntryController = async (req, res) => {
  try {
    console.info('Fetching a random entry');

    const entry = await entryRepo.getRandom();

    if (!entry) {
      return res.status(404).json({
        message: 'No entries are available.',
      });
    }

    return res.status(200).json(entry);
  } catch (error) {
    console.error('Error fetching a random entry', error);

    throw new Error(
      `Error fetching a random entry: ${error.message}`,
    );
  }
};