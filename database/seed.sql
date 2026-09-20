-- Sample data for local development and manual API testing.
-- Run after database/schema.sql.

USE my_joy_jar;

INSERT INTO entries (category, content, created_at)
VALUES
  (
    'gratitude',
    'I am grateful for having time to rest today.',
    '2026-09-17 10:30:00'
  ),
  (
    'compliment',
    'Someone told me that I explained an idea clearly.',
    '2026-09-17 15:45:00'
  ),
  (
    'joyful-moment',
    'I enjoyed feeling the sunshine through the window.',
    '2026-09-18 09:15:00'
  ),
  (
    'gratitude',
    'I appreciated having a calm and unhurried morning.',
    '2026-09-18 12:20:00'
  ),
  (
    'compliment',
    'Someone said that my enthusiasm made them smile.',
    '2026-09-19 11:05:00'
  ),
  (
    'joyful-moment',
    'I completed the initial setup for a project I care about.',
    '2026-09-19 16:10:00'
  );


-- Additional sample entries

INSERT INTO entries (category, content)
VALUES
  (
    'gratitude',
    'I am grateful that I connected MyJoyJar to a database.'
  ),
  (
    'gratitude',
    'I am grateful that my database connection works.'
  ),
  (
    'compliment',
    'Someone said that I explained my project clearly.'
  ),
  (
    'joyful-moment',
    'I enjoyed building my first Express API with MySQL.'
  );
