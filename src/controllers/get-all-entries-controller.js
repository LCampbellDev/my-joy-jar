export const createGetAllEntriesController = (entryRepository) => {
  return async (req, res) => {
    const entries = await entryRepository.getAllEntries();

    return res.status(200).json(entries);
  };
};
