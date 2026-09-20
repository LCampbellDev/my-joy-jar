-- Create the database and entries table.

CREATE DATABASE IF NOT EXISTS my_joy_jar;

USE my_joy_jar;

CREATE TABLE IF NOT EXISTS entries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_entry_category CHECK (
    category IN (
      'gratitude',
      'compliment',
      'joyful-moment'
    )
  )
);
