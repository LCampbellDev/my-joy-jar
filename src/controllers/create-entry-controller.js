import { entryRepo } from "../repositories/mysql-entry-repository";
import { validateEntryInput } from "../validation/validate-entry-input";

export const createEntryController = async (req, res) => {
  const { category, content } = req.body ?? {};

  const validationErrors = validateEntryInput({
    category,
    content,
  });

  if (validationErrors.length) {
    return res.status(400).json({
      message: "Validation errors.",
      errors: validationErrors,
    });
  }

  const entry = await entryRepo.create({
    category,
    content: content.trim(),
  });

  return res.status(201).json({
    message: "Entry created successfully.",
    entry,
  });
};

