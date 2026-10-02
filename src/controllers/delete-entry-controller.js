export const createDeleteEntryController = (entryRepository) => {
  return async (req, res) => {
    const entryId = Number(req.params.id);

    if (!Number.isInteger(entryId) || entryId <= 0) {
      return res.status(400).json({
        message: "Entry ID must be a positive integer.",
      });
    }

    const entry = await entryRepository.deleteEntryById(entryId);

    if (!entry) {
      return res.status(404).json({
        message: "Entry not found.",
      });
    }

    return res.status(200).json({
      message: "Entry deleted successfully.",
      entry,
    });
  };
};
