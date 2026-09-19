import entriesList from "../data/entries.js";

// TODO: Make async when entries are retrieved from MySQL
export const getAllEntries = (req, res) => {
  return res.status(200).json(entriesList);
};
