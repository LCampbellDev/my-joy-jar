// Temporary in-memory data used until MySQL persistence is added.
// Planned columns: id (auto-incrementing primary key), category, content,
// and created_at (defaults to the current timestamp).

const entriesList = [
  // sample entries
  {
    id: 1,
    category: "gratitude",
    content: "I am grateful for having time to rest today.",
    createdAt: "2026-09-17T10:30:00.000Z",
  },
  {
    id: 2,
    category: "compliment",
    content: "Someone told me that I explained an idea clearly.",
    createdAt: "2026-09-17T15:45:00.000Z",
  },
  {
    id: 3,
    category: "joyful-moment",
    content: "I enjoyed feeling the sunshine through the window.",
    createdAt: "2026-09-18T09:15:00.000Z",
  },
  {
    id: 4,
    category: "gratitude",
    content: "I appreciated having a calm and unhurried morning.",
    createdAt: "2026-09-18T12:20:00.000Z",
  },
  {
    id: 5,
    category: "compliment",
    content: "Someone said that my enthusiasm made them smile.",
    createdAt: "2026-09-19T11:05:00.000Z",
  },
  {
    id: 6,
    category: "joyful-moment",
    content: "I completed the initial setup for a project I care about.",
    createdAt: "2026-09-19T16:10:00.000Z",
  },
];

export default entriesList;
