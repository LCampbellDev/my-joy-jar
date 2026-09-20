import database from "../config/database.js";

// Delete an entry using its ID.
export const deleteEntry = async (req, res) => {
  const entryId = Number(req.params.id);

  // validate input
  if (!Number.isInteger(entryId) || entryId <= 0) {
    return res.status(400).json({
      message: "Entry ID must be a positive integer.",
    });
  }

  // Retrieve the entry before deleting it
  const [entries] = await database.execute(
    `SELECT
      id,
      category,
      content,
      created_at AS createdAt
    FROM entries
    WHERE id = ?`,
    [entryId],
  );

  if (entries.length === 0) {
    return res.status(404).json({
      message: "Entry not found.",
    });
  }

  const [deletedEntry] = entries;

  // Delete the entry from MySQL
  await database.execute("DELETE FROM entries WHERE id = ?", [entryId]);

  return res.status(200).json({
    message: "Entry deleted successfully.",
    entry: deletedEntry,
  });
};
