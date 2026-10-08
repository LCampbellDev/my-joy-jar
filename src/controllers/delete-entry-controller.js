import { entryRepo } from '../repositories/mysql-entry-repository';
import { isValidId } from '../validation/is-valid-id';

export const deleteEntryController = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({
      message: 'Entry ID must be a positive integer.',
    });
  }

    const entryId = Number(id);     

  const entry = await entryRepo.delete(entryId);

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