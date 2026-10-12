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

The entry router maps each API endpoint to the relevant controller. Controllers validate requests, call repository methods, and construct HTTP responses. The repository handles parameterised MySQL queries.

Controllers log database failures and throw errors with operation-specific context. Central error middleware in `src/app.js` returns a consistent `500 Internal Server Error` JSON response.

### Health check

`GET /health` returns status 200 with:

```json
{
  "status": "ok"
}
```

This is a liveness check: it confirms the server can respond to HTTP
requests. It does not check MySQL connectivity or database readiness.

```text
my-joy-jar/
├── database/
│   ├── schema.sql
│   └── seed.sql
├── src/
│   ├── config/
│   │   └── database.js
│   ├── constants/
│   │   ├── entry-categories.js
│   │   ├── http-status.js
│   │   ├── response-messages.js
│   │   ├── error-context.js
│   │   ├── validation-messages.js
│   │   ├── pagination.js
│   │   ├── log-messages.js
│   │   └── rate=limit.js
│   ├── controllers/
│   │   ├── create-entry-controller.js
│   │   ├── create-entry-controller.test.js
│   │   ├── delete-entry-controller.js
│   │   ├── delete-entry-controller.test.js
│   │   ├── get-all-entries-controller.js
│   │   ├── get-all-entries-controller.test.js
│   │   ├── get-random-entry-controller.js
│   │   └── get-random-entry-controller.test.js
│   ├── helpers/
│   │   ├── create-pagination.js
│   │   └── create-pagination.test.js
│   ├── middleware/
│   │   ├── error-handler.js
│   │   ├── error-handler.test.js
│   │   ├── create-entry-rate-limiter.js
│   │   ├── create-entry-rate-limiter.api.test.js
│   │   └── security-headers.api.test.js
│   ├── repositories/
│   │   ├── mysql-entry.repo.js
│   │   ├── create-entry.repo.test.js
│   │   ├── delete-entry.repo.test.js
│   │   ├── get-all-entries.repo.test.js
│   │   └── get-random-entry.repo.test.js
│   ├── routes/
│   │   ├── entries.js
│   │   ├── entries.test.js
│   │   ├── create-entry.api.test.js
│   │   ├── delete-entry.api.test.js
│   │   ├── get-all-entries.api.test.js
│   │   ├── get-random-entry.api.test.js
│   │   ├── health.js
│   │   └── health.api.test.js
│   ├── scripts/
│   │   └── test-db-connection.js
│   ├── validation/
│   │   │   └── helpers
│   │   │       ├── is-positive-integer-string.js
│   │   │       └── is-positive-integer-string.test.js
│   │   ├── validate-entry-input.js
│   │   ├── validate-entry-input.test.js
│   │   ├── validate-pagination.js
│   │   └── validate-pagination.test.js
│   ├── app.js
│   └── server.js
├── tests/
│   ├── mock-entries.js
│   ├── mock-entry-inputs.js
│   └── test-helpers.js
├── docs/
├── documentation/
│   ├── testing.md
│   └── testing.json
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── api-requests.http
├── eslint.config.js
├── jest.config.js
├── jsdoc.config.json
├── package.json
├── README.md
└── webpack.config.cjs
```

`docs/` contains generated HTML documentation and is excluded from Git.
`documentation/` contains the Markdown guides used to generate it.

## Current functionality

The API currently supports:

| Method   | Route                 | Purpose                   |
| -------- | --------------------- | ------------------------- |
| `GET`    | `/api/entries`        | Retrieve all entries      |
| `POST`   | `/api/entries`        | Create a new entry        |
| `GET`    | `/api/entries/random` | Retrieve a random entry   |
| `DELETE` | `/api/entries/:id`    | Delete a specified entry  |
| `HEALTH` | `/api/entries/health` | Confirm server responsive |

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

### Development workflow

Use two terminals from the project root.

In terminal 1, start Webpack in watch mode:

```bash
npm run dev
```

Wait for the first successful compilation. Webpack generates
`dist/server.cjs` and rebuilds it when source files change.

In terminal 2, start the development server with Nodemon:

```bash
npm run dev:server
```

Nodemon watches the generated bundle and automatically restarts the
server when it changes.

The API runs at http://localhost:3000.

Stop both processes with Ctrl+C in their respective terminals.

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

## Automated testing

MyJoyJar uses Jest for unit tests and Supertest for API tests. Tests are kept alongside the code they exercise, with one API test file per endpoint.

### Unit tests

Unit tests cover:

- controller success, validation, empty-result and failure responses;
- entry input and ID validation;
- route-to-controller wiring;
- repository results, parameterised query arguments and database failures.

Controller tests mock the repository. Repository tests exercise the real repository methods with a mocked `database.execute`.

Shared fixtures and mock helpers reduce duplication. Tests use Arrange–Act–Assert, and ESM module mocks are registered before dynamically importing the module under test.

Run unit tests:

```bash
npm run unit-test
```

Run unit tests with coverage:

```bash
npm run unit-test -- --coverage
```

The current suite contains 53 passing unit tests and reports 100% statement, branch, function and line coverage for the files measured by that run. This report does not include `app.js` or `server.js`.

### API tests

Supertest sends HTTP requests through the configured Express app, exercising routing, JSON request parsing, controllers, validation and error middleware.

The 13 API tests cover all four endpoints, including successful requests, empty results, invalid input, missing entries and repository failures.

The repository is mocked, so API tests do not require a running MySQL database. They verify HTTP behaviour rather than repeating repository interaction assertions.

Run API tests:

```bash
npm run api-test
```

Run API tests with coverage:

```bash
npm run api-test -- --coverage
```

Run both suites:

```bash
npm test
```

### Testing scope

Automated tests use mocked database results. They do not verify SQL execution, schema compatibility or persistence against a real MySQL database.

Manual database and API checks complement these tests. Server startup has also been checked with `npm start`.

### Code coverage

Run all unit and API tests together with Jest coverage:

```bash
npm run test:coverage
```

The command prints a coverage table in the terminal and generates an HTML
report at `coverage/index.html`.

Coverage includes application JavaScript files under `src/`, including
files not imported by tests. Test files are excluded from measurement.
Generated reports are excluded from Git.

The combined report includes coverage from both unit and API tests.
Validation exercised by unit tests therefore contributes to the overall
report, even when individual API tests do not exercise every validation case.

Currently, `server.js` and `src/scripts/test-db-connection.js` are not
covered by the automated suite. They remain visible in the report.

Coverage shows which code executed; it does not prove every behaviour is
correct. Database configuration coverage also does not verify a real
MySQL connection, and mocked repository tests do not execute SQL against
a real database.

### Coverage thresholds

Controllers, middleware, repositories, routes and validation files must
each achieve 100% statement, branch, function and line coverage.

`npm run test:coverage` fails if these thresholds are not met.
The regular `npm test` command does not enforce coverage thresholds.

Startup and database diagnostic files remain included in the report
without a coverage threshold.

These checks run locally. Enforcing them on pull requests also requires
CI to run the coverage command and a required check in GitHub.

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

### Get entries

`GET /api/entries` returns a page of entries, ordered newest first.
Entries with matching creation timestamps are ordered by ID descending.

#### Query parameters

| Parameter | Default | Description                                      |
| --------- | ------- | ------------------------------------------------ |
| `page`    | 1       | Positive integer identifying the requested page. |
| `limit`   | 10      | Positive integer page size, up to 100.           |

Example:

```http
GET http://localhost:3000/api/entries?page=2&limit=10
```

#### Response

Returns status 200 with an object containing `entries` and `pagination`.
This replaces the previous array-only response.

```json
{
  "entries": [
    {
      "id": 15,
      "category": "gratitude",
      "content": "I am grateful for a peaceful morning.",
      "createdAt": "2026-10-12T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 11,
    "totalPages": 2
  }
}
```

`total` counts all entries. `totalPages` is the total count divided by
the page size, rounded up.

An empty jar returns `entries: []`, `total: 0` and `totalPages: 0`.
A page beyond the available results also returns an empty array with
status 200, preserving the requested page number.

#### Validation

Parameters must be positive integer strings without leading zeros.
Empty values, decimals, negative numbers, repeated parameters and unsafe
integer values are rejected.

A limit above 100 or an offset calculation outside the safe integer range
is also rejected.

Invalid parameters return status 400, for example:

```json
{
  "message": "Validation errors.",
  "errors": [
    "Page must be a positive integer.",
    "Limit must be no greater than 100."
  ]
}
```

#### Pagination limitations

Entries and their total count are retrieved with separate queries.
Concurrent inserts or deletes can affect their consistency and can shift
entries between pages.

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

## Security middleware

Helmet adds security-related HTTP response headers to successful and
error responses, and removes the `X-Powered-By` header.

The entry API allows 100 requests per client IP address within a
15-minute window. Requests beyond the allowance receive status 429:

    { "message": "Too many requests. Please try again later." }

Rate-limit headers describe the allowance, and blocked responses include
`Retry-After`, indicating how many seconds to wait before retrying.
The `/health` endpoint is outside the entry API limit.

The limiter uses an in-memory store. Counts reset when the server restarts
and are not shared between server processes. A deployment with multiple
instances would need a shared store. Proxy settings must also be reviewed
for the actual hosting setup so client addresses are identified correctly.

Malformed JSON request bodies receive status 400 with:

    { "message": "Request body must contain valid JSON." }

Unexpected application failures continue to receive a generic 500 response.

## Documentation

Generate the HTML documentation:

```bash
npm run docs
```

Open docs/index.html in your browser.
The documentation includes this README as its homepage, a testing guide,
and a reference generated from JSDoc comments in the source files.
Documentation guides are maintained in documentation/.
Generated HTML is written to docs/ and is excluded from Git.

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
- Jest — unit testing
- Supertest — API testing

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

Builds the server bundle with Webpack and watches for source changes.

```bash
npm run dev:server
```

Starts the server with Nodemon and restarts it when the generated bundle changes.

```bash
npm run build
```

Builds the backend with Webpack, generating `dist/server.cjs`. Run this before `npm start`.

```bash
npm start
```

Starts the built server without watching for changes. Run `npm run build` first.

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

Runs the unit tests followed by the API tests.

```bash
npm run unit-test
```

Runs unit tests, excluding `.api.test.js` files.

```bash
npm run api-test
```

Runs the `.api.test.js` files.

```bash
npm run unit-test -- --coverage
```

Runs unit tests and generates a coverage report.

```bash
npm run api-test -- --coverage
```

Runs API tests and generates a coverage report.

## Engineering goals

This project provides a focused environment for practising:

- designing REST endpoints with Node.js and Express;
- applying DRY (Don’t Repeat Yourself) by extracting reusable validation, test fixtures and mock helpers;
- separating routes, controllers, repositories, validation and configuration;
- validating request data and returning useful HTTP responses;
- collecting multiple validation errors in an array;
- executing parameterised MySQL queries;
- migrating from temporary in-memory data to persistent storage;
- writing unit and API tests with Jest and Supertest;
- mocking dependencies to test success and failure paths;
- using coverage reports to identify untested code paths;
- handling unexpected errors consistently.

The API uses Express REST routes to strengthen my understanding of HTTP, routing, middleware and data persistence before exploring GraphQL.

## Next steps

- Review the architecture and testing approach.
- Add integration tests against a dedicated MySQL test database.
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
