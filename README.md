# MyJoyJar

MyJoyJar is a personal digital jar for saving gratitude, compliments, and joyful moments—and rediscovering them whenever they are needed.

This repository currently contains a JavaScript and Express REST API. I am building the project incrementally, beginning with the API before adding persistent storage and a frontend.

## Project idea

In a physical gratitude jar, someone might record positive experiences on pieces of paper and return to them later.

MyJoyJar brings that idea into a digital application. Entries can record:

- something the user feels grateful for;
- a compliment or kind thing someone said;
- a joyful or meaningful moment.

Users can view their entries or draw one at random.

## Current functionality

The API currently supports:

| Method   | Route                 | Purpose                  |
| -------- | --------------------- | ------------------------ |
| `GET`    | `/api/entries`        | Retrieve all entries     |
| `POST`   | `/api/entries`        | Create a new entry       |
| `GET`    | `/api/entries/random` | Retrieve a random entry  |
| `DELETE` | `/api/entries/:id`    | Delete a specified entry |

Entries are temporarily stored in memory. Any changes are lost when the server restarts.

## Entry structure

```json
{
  "id": 1,
  "category": "gratitude",
  "content": "I am grateful for having time to rest today.",
  "createdAt": "2026-09-19T16:30:00.000Z"
}
```

Supported categories:

- `gratitude`
- `compliment`
- `joyful-moment`

## Creating an entry

Send a POST request to:

```http
POST /api/entries
```

with a JSON body:

```json
{
  "category": "joyful-moment",
  "content": "I enjoyed sitting outside in the sunshine."
}
```

A successful request returns `201 Created` and the new entry.

The API rejects:

- missing categories;
- missing or blank content;
- categories outside the supported values.

## Retrieving a random entry

Send:

```http
GET /api/entries/random
```

The API returns one randomly selected entry. If the jar is empty, it returns an appropriate error response.

## Deleting an entry

Include the entry ID in the URL:

```http
DELETE /api/entries/3
```

A successful request returns the deleted entry. The API returns `404 Not Found` when no entry has the requested ID.

## Technology

- JavaScript
- Node.js
- Express
- Morgan
- dotenv
- Nodemon
- Jest
- Supertest
- ESLint
- Prettier

## Project structure

```text
my-joy-jar/
├── src/
│   ├── constants/
│   │   └── entry-categories.js
│   ├── controllers/
│   │   └── entry-controller.js
│   ├── data/
│   │   └── entries.js
│   ├── routes/
│   │   └── entry-routes.js
│   ├── app.js
│   └── server.js
├── tests/
├── eslint.config.js
├── package.json
└── README.md
```

## Running the project locally

### Prerequisites

- Node.js 18 or later
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/LCampbellDev/my-joy-jar.git
cd my-joy-jar
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:3000
```

## Available scripts

```bash
npm run dev
```

Starts the development server with Nodemon.

```bash
npm start
```

Starts the server with Node.js.

```bash
npm test
```

Runs the Jest test suite.

```bash
npm run lint
```

Checks the JavaScript files with ESLint.

```bash
npm run format
```

Formats supported files with Prettier.

```bash
npm run format:check
```

Checks formatting without changing files.

## Engineering goals

This project provides a focused environment for practising:

- designing REST endpoints with Node.js and Express;
- separating routes, controllers, constants, and data access;
- validating request data and returning appropriate HTTP responses;
- testing API behaviour manually and through automated tests;
- replacing temporary in-memory data with MySQL persistence.

The API begins with Express REST routes to strengthen the underlying HTTP, routing, and middleware foundations before exploring GraphQL.

## Next steps

- Decide on the automated testing approach for the Express routes.
- Create a MySQL entries table.
- Replace the temporary in-memory array with persistent storage.
- Add database configuration using environment variables.
- Build an accessible frontend.
- Add end-to-end tests for complete user journeys.

## Future ideas

Possible later features include:

- filtering entries by category or date;
- editing existing entries;
- selecting daily, weekly, or monthly reflection prompts;
- marking meaningful entries as favourites or exporting saved entries to a file;
- integrating positive quotations from an external API;
- offering a hand-drawn or retro-inspired visual theme.
