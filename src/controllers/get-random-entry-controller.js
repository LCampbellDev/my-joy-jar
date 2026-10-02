export const createGetRandomEntryController = (entryRepository) => {
  return async (req, res) => {
    const entry = await entryRepository.getRandomEntry();

    if (!entry) {
      return res.status(404).json({
        message: 'No entries are available.',
      });
    }

    return res.status(200).json(entry);
  };
};