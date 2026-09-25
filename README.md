# MyJoyJar

MyJoyJar is a personal digital jar for saving gratitude, compliments, and joyful moments. And rediscovering them whenever they are needed.

This repository contains a JavaScript REST API built with Node.js, Express, and MySQL. I am building the project incrementally, beginning with the backend API and persistent storage before adding a frontend.

## Project idea

In a physical gratitude jar, someone might record positive experiences on pieces of paper and return to them later.

MyJoyJar brings that idea into a digital application. Entries can record:

- something the user feels grateful for;
- a compliment or kind thing someone said;
- a joyful or meaningful moment.

Users can view their entries or draw one at random.

## Project structure

Routes and controller logic are kept separate.

Each entry operation has its own controller:

- `get-all-entries-controller.js`
- `get-random-entry-controller.js`
- `create-entry-controller.js`
- `delete-entry-controller.js`

The entry router maps each API endpoint to the relevant controller. The controllers validate requests, execute parameterised MySQL queries, and construct the HTTP responses.

```text
my-joy-jar/
├── database/
│ ├── schema.sql
│ └── seed.sql
├── src/
│ ├── config/
│ │ └── database.js
│ ├── constants/
│ │ └── entry-categories.js
│ ├── controllers/
│ │ ├── create-entry-controller.js
│ │ ├── delete-entry-controller.js
│ │ ├── get-all-entries-controller.js
│ │ ├── get-random-entry-controller.js
│ │ └── index.js
│ ├── routes/
│ │ └── entry-routes.js
│ ├── scripts/
│ │ └── test-db-connection.js
│ ├── validation/
│ │ └── validate-entry-input.js
│ ├── app.js
│ └── server.js
├── .env.example
├── api-requests.http
├── eslint.config.js
├── package.json
└── README.md
```
## Current functionality

The API currently supports:

| Method   | Route                 | Purpose                  |
| -------- | --------------------- | ------------------------ |
| `GET`    | `/api/entries`        | Retrieve all entries     |
| `POST`   | `/api/entries`        | Create a new entry       |
| `GET`    | `/api/entries/random` | Retrieve a random entry  |
| `DELETE` | `/api/entries/:id`    | Delete a specified entry |

## Database setup

MyJoyJar uses MySQL to persist entries.

The `database` directory contains:

- `schema.sql` — creates the `my_joy_jar` database and `entries` table.
- `seed.sql` — adds optional sample entries for local development and manual testing.

### Environment variables

Copy `.env.example` to a new local file named `.env` and provide your MySQL connection details:

```env

# Application config

PORT=3000

# Database config

DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=my_joy_jar
```

The `.env` file is ignored by Git and must not be committed.

### Create and seed the database

Using DBeaver or another MySQL client:

1. Run `database/schema.sql` to create the database and table.
2. Optionally run `database/seed.sql` to insert sample entries.

Running `seed.sql` more than once will insert duplicate sample entries.

Test the database connection from the project:

```bash
npm run db:test
```

A successful connection displays the database name and connection time.

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

## Manual API testing

The `api-requests.http` file contains example HTTP requests for manually testing the API.

It includes:

- requests to retrieve all entries;
- requests to create valid entries;
- invalid requests that demonstrate the validation error responses;
- a request to retrieve a random entry;
- requests to delete an entry by ID.

Start the development server before sending the requests:

```bash
npm run dev
```

The requests can be run using a compatible VS Code HTTP client extension or copied into Postman.

Morgan logs each HTTP request in the terminal running the development server, including the request method, route, response status, response time, and response size.

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
- categories with an incorrect data type;
- categories outside the supported values;
- missing, blank, or non-string content.

When a request contains multiple validation problems, the API returns all validation errors in an array.

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

A successful request returns the deleted entry. The API returns `400 Bad Request` if the ID is not a positive integer and `404 Not Found` when no entry has the requested ID.

## Technology

- JavaScript
- Node.js
- Express
- MySQL
- mysql2
- Morgan
- dotenv
- Nodemon
- ESLint
- Prettier
- Jest and Supertest — installed for future automated testing

## Running the project locally

### Prerequisites

- Node.js 24 LTS — developed and tested with Node.js 24.20.0
- npm
- MySQL
- DBeaver or another MySQL client

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

The API runs at [http://localhost:3000](http://localhost:3000).

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

```bash
npm run db:test
```

Tests the connection to the configured MySQL database.

```bash
npm test
```

Runs Jest. Automated tests have not yet been added.

## Engineering goals

This project provides a focused environment for practising:

- designing REST endpoints with Node.js and Express;
- separating route definitions, controller logic, constants, and database configuration;
- validating request data and returning useful HTTP responses;
- collecting multiple validation errors in an array;
- executing parameterised MySQL queries;
- migrating from temporary in-memory data to persistent storage;
- testing API behaviour manually before introducing automated tests.

The API uses Express REST routes to strengthen my understanding of HTTP, routing, middleware, and data persistence before exploring GraphQL.

## Next steps

- Decide on the automated testing approach for the Express routes.
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
