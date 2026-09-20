import { ALLOWED_CATEGORIES } from "../constants/entry-categories.js";

const isMissingValue = (value) =>
  value === undefined || value === null || value === "";

// Validate the category and content required to create (POST)
// or fully replace (PUT) an entry
/* TODO: If PATCH support is added, create a separate partial-update
validator or adapt this validator to support optional fields. */
export const validateEntryInput = ({ category, content } = {}) => {
  const validationErrors = [];

  if (isMissingValue(category)) {
    validationErrors.push("Category is required.");
  } else if (typeof category !== "string") {
    validationErrors.push("Category must be a string.");
  } else if (!ALLOWED_CATEGORIES.includes(category)) {
    validationErrors.push(
      `Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}.`,
    );
  }

  if (isMissingValue(category)) {
    validationErrors.push("Category is required.");
  } else if (typeof content !== "string") {
    validationErrors.push("Content must be a string.");
  } else if (!content.trim()) {
    validationErrors.push("Content cannot be empty.");
  }

  return validationErrors;
};
