# MyJoyJar

MyJoyJar is a personal digital jar for saving gratitude, compliments and joyful moments, and rediscovering them whenever they are needed.

This repository contains a JavaScript REST API built with Node.js, Express and MySQL. I am building the project incrementally, beginning with the backend API and persistent storage before adding a frontend.

## Project idea

In a physical gratitude jar, someone might record positive experiences on pieces of paper and return to them later.

MyJoyJar brings that idea into a digital application. Entries can record:

- Something the user feels grateful for.
- A compliment or kind thing someone said.
- A joyful or meaningful moment.

Entries can be viewed in pages or drawn at random.

## Current functionality

| Method   | Route                 | Purpose                     |
| -------- | --------------------- | --------------------------- |
| `GET`    | `/api/entries`        | Retrieve a page of entries  |
| `POST`   | `/api/entries`        | Create an entry             |
| `GET`    | `/api/entries/random` | Retrieve a random entry     |
| `DELETE` | `/api/entries/:id`    | Delete an entry             |
| `GET`    | `/health`             | Check server liveness       |
| `GET`    | `/ready`              | Checks connection to MySQL. |

The API currently uses one shared collection of entries. User accounts, authentication and private jars are planned.

## Technology

- JavaScript
- Node.js
- Express — routing and middleware
- MySQL — database
- mysql2 — MySQL client with promise support
- Morgan — HTTP request logging
- dotenv — environment variable loading
- Nodemon — automatic server restarts during development
- Webpack — bundles the server and resolves extensionless imports
- webpack-cli — runs Webpack commands
- webpack-node-externals — keeps Node dependencies outside the bundle
- ESLint — code linting
- Prettier — code formatting
- Jest — unit and API test runner, with coverage reporting
- Supertest — HTTP assertions for API tests
- JSDoc — generates HTML documentation from source comments
- Helmet — security-related HTTP response headers
- express-rate-limit — entry API request limiting
- GitHub Actions — automated quality checks

## Running the project locally

### Prerequisites

- Node.js 24, matching the CI environment
- npm
- A running MySQL server
- DBeaver or another MySQL client for running the setup scripts

### Installation

Clone the repository and install dependencies from the committed lockfile:

```bash
git clone https://github.com/LCampbellDev/my-joy-jar.git
cd my-joy-jar
npm ci
```

### Environment variables

Copy `.env.example` to a local file named `.env` and provide your MySQL connection details:

```dotenv
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

The `database/` directory contains:

- `schema.sql` — creates the `my_joy_jar` database and `entries` table.
- `seed.sql` — adds optional sample entries for development and manual testing.

Using DBeaver or another MySQL client:

1. Run `database/schema.sql`.
2. Optionally run `database/seed.sql`.

Running `seed.sql` more than once inserts duplicate sample entries.

Check the database connection:

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

Wait for the first successful compilation. Webpack generates `dist/server.cjs` and rebuilds it when source files change.

In terminal 2, start the server with Nodemon:

```bash
npm run dev:server
```

Nodemon watches the generated bundle and restarts the server when it changes. The `dev` script alone does not start the server.

With the default port, the API runs at [http://localhost:3000](http://localhost:3000). Stop both processes with Ctrl+C in their respective terminals.

### Build and start without watching

Build the server, then run the generated bundle:

```bash
npm run build
npm start
```

Rebuild and restart after source changes when using this workflow.

## API reference

Examples below use the default port, 3000.

### Entry structure

Entries are stored in MySQL. The API represents an entry as:

```json
{
  "id": 1,
  "category": "gratitude",
  "content": "I am grateful for having time to rest today.",
  "createdAt": "2026-10-12T12:00:00.000Z"
}
```

Supported categories:

- `gratitude`
- `compliment`
- `joyful-moment`

The values in `src/constants/entry-categories.js` must remain consistent with the category check constraint in `database/schema.sql`.

### Get entries

`GET /api/entries` returns a page of entries, ordered by creation date descending. Entries with matching timestamps are ordered by ID descending.

#### Query parameters

| Parameter | Default | Description                                     |
| --------- | ------- | ----------------------------------------------- |
| `page`    | 1       | Positive integer identifying the requested page |
| `limit`   | 10      | Positive integer page size, up to 100           |

```http
GET http://localhost:3000/api/entries?page=2&limit=10
```

#### Response

Returns `200 OK` with `entries` and pagination metadata:

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

`total` counts all entries. `totalPages` is the total divided by the page size, rounded up.

An empty jar returns `entries: []`, `total: 0` and `totalPages: 0`. A page beyond the available results also returns an empty entries array with status 200, preserving the requested page number.

#### Validation

Query values must be positive integer strings without leading zeros. Empty values, decimals, negative numbers, repeated parameters and unsafe integer values are rejected.

A limit above 100 or an offset calculation outside the safe integer range is also rejected.

For example, `?page=0&limit=101` returns `400 Bad Request`:

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

Entries and their total count are retrieved with separate queries. Concurrent inserts or deletes can affect their consistency and shift entries between pages.

### Create an entry

Send a JSON request body:

```http
POST http://localhost:3000/api/entries
Content-Type: application/json

{
  "category": "joyful-moment",
  "content": "I enjoyed sitting outside in the sunshine."
}
```

A successful request returns `201 Created` with a message and the created entry:

```json
{
  "message": "Entry created successfully.",
  "entry": {
    "id": 16,
    "category": "joyful-moment",
    "content": "I enjoyed sitting outside in the sunshine.",
    "createdAt": "2026-10-12T13:00:00.000Z"
  }
}
```

The API rejects missing, non-string or unsupported categories, and missing, non-string or whitespace-only content. Valid content is trimmed before it is stored.

Content is limited to 2,000 UTF-16 code units after trimming. Many emoji count as two units; composed emoji can count as more.

Validation returns the first applicable error for each field, collecting category and content errors in that order. Invalid input returns `400 Bad Request`:

```json
{
  "message": "Validation errors.",
  "errors": ["Category is required.", "Content is required."]
}
```

Possible error responses:

- `400 Bad Request` — invalid entry data or malformed JSON.
- `413 Content Too Large` — the request body exceeds the parser limit.
- `415 Unsupported Media Type` — unsupported content encoding or charset.
- `429 Too Many Requests` — the entry API rate limit is exceeded.
- `500 Internal Server Error` — an unexpected server or database failure.

See [Request parsing and unexpected failures](#request-parsing-and-unexpected-failures) for parsing-error response messages.

### Retrieve a random entry

```http
GET POST http://localhost:3000/api/entries
```

Returns `200 OK` with one randomly selected entry. An empty jar returns `404 Not Found`:

```json
{
  "message": "No entries are available."
}
```

### Delete an entry

Include the entry ID in the URL:

```http
DELETE http://localhost:3000/api/entries/3
```

A successful request returns `200 OK` with a success message and the deleted entry.

Entry IDs must be positive integer strings without leading zeros and within JavaScript’s safe integer range. Invalid ID format returns `400 Bad Request`:

```json
{
  "message": "Entry ID must be a positive integer."
}
```

When no matching entry exists, the API returns `404 Not Found`:

```json
{
  "message": "Entry not found."
}
```

### Health and readiness checks

`GET /health` checks application liveness. It returns `200`:

```json
{
  "status": "ok"
}
```

`GET /ready` checks database readiness by running `SELECT 1`. This checks whether MySQL accepts a query without reading or changing application data.

When the query succeeds, it returns `200`:

```json
{
  "status": "ready"
}
```

When the query fails, it returns `503`:

```json
{
  "status": "not ready"
}
```

Database failures are logged without exposing internal details in the response. The readiness check does not verify the database schema or every API operation.

Both endpoints are outside the entry API rate limiter.

## Security middleware and error responses

### Security headers

Helmet adds security-related response headers to successful and error responses, and removes `X-Powered-By`.

Some headers primarily protect browser documents; their benefit is more limited for a JSON-only API.

### Request limits

The entry API allows 100 requests per client within a 15-minute window, using the package's IP-based client identification. Its default handling groups IPv6 addresses by subnet.

Requests beyond the allowance receive `429 Too Many Requests`:

```json
{
  "message": "Too many requests. Please try again later."
}
```

Rate-limit headers describe the allowance. Blocked responses include `Retry-After`, indicating how many seconds to wait before retrying.

The limiter runs before JSON parsing for entry API requests. The `/health` endpoint is outside this limit.

Counts are held in memory, reset when the server restarts, and are not shared between server processes. A deployment with multiple instances would need a shared store. Proxy settings must be reviewed for the actual hosting setup so client addresses are identified correctly.

### Request parsing and unexpected failures

Requests must contain valid JSON when sent with `Content-Type: application/json`.

- Malformed JSON returns `400` with the message “Request body must contain valid JSON.”
- Bodies exceeding the JSON parser’s default `100kb` limit (102,400 bytes) return `413`.
- Other exposable parser errors retain their `4xx` status, such as `415` for unsupported content encoding.
- These other parser errors use the message “The request could not be processed.”
- Unexpected server failures return `500` with a generic message and are logged centrally.

Internal error details are not included in API responses.

Security headers and rate limiting do not provide authentication or restrict access to individual users' entries.

## Architecture and project structure

The entry router maps endpoints to their controllers. Controllers validate requests, call repository methods and construct HTTP responses. The repository handles parameterised MySQL queries.

Each entry operation has its own controller:

- `get-all-entries-controller.js`
- `get-random-entry-controller.js`
- `create-entry-controller.js`
- `delete-entry-controller.js`

Controllers wrap repository failures with operation-specific context and preserve the original error using `cause`. Central middleware in `src/middleware/error-handler.js`, mounted last in `app.js`, handles error responses and logs unexpected failures.

Morgan separately logs HTTP request summaries. Validation helpers check inputs, and application helpers build reusable data such as pagination metadata.

### Project tree

```text
my-joy-jar/
├── .github/
│   └── workflows/
│       └── quality-checks.yml
├── database/
│   ├── schema.sql
│   └── seed.sql
├── documentation/
│   ├── testing.md
│   └── testing.json
├── src/
│   ├── config/
│   │   └── database.js
│   ├── constants/
│   │   ├── entry-content.js
│   │   ├── entry-categories.js
│   │   ├── error-context.js
│   │   ├── http-status.js
│   │   ├── log-messages.js
│   │   ├── pagination.js
│   │   ├── rate-limit.js
│   │   ├── response-messages.js
│   │   ├── validation-messages.js
│   │   └── health-status.js
│   ├── controllers/
│   │   ├── create-entry-controller.js
│   │   ├── create-entry-controller.test.js
│   │   ├── delete-entry-controller.js
│   │   ├── delete-entry-controller.test.js
│   │   ├── get-all-entries-controller.js
│   │   ├── get-all-entries-controller.test.js
│   │   ├── get-random-entry-controller.js
│   │   ├── get-random-entry-controller.test.js
│   │   ├── readiness-controller.js
│   │   └── readiness-controller.test.js
│   ├── helpers/
│   │   ├── create-pagination.js
│   │   ├── create-pagination.test.js
│   │   ├── is-positive-integer-string.js
│   │   └── is-positive-integer-string.test.js
│   ├── middleware/
│   │   ├── create-entry-rate-limiter.js
│   │   ├── create-entry-rate-limiter.api.test.js
│   │   ├── error-handler.js
│   │   ├── error-handler.test.js
│   │   └── security-headers.api.test.js
│   ├── repositories/
│   │   ├── mysql-entry.repo.js
│   │   ├── create-entry.repo.test.js
│   │   ├── delete-entry.repo.test.js
│   │   ├── get-all-entries.repo.test.js
│   │   ├── get-random-entry.repo.test.js
│   │   └── database-health.repo.js
│   ├── routes/
│   │   ├── entries.js
│   │   ├── entries.test.js
│   │   ├── create-entry.api.test.js
│   │   ├── delete-entry.api.test.js
│   │   ├── get-all-entries.api.test.js
│   │   ├── get-random-entry.api.test.js
│   │   ├── health.js
│   │   ├── health.api.test.js
│   │   ├── ready.js
│   │   └── ready.api.test.js
│   ├── scripts/
│   │   └── test-db-connection.js
│   ├── validation/
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
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── api-requests.http
├── eslint.config.js
├── jest.config.js
├── jsdoc.config.json
├── package-lock.json
├── package.json
├── README.md
└── webpack.config.cjs
```

`documentation/` contains maintained guides. `docs/` contains generated HTML and is excluded from Git. Other generated directories, such as `dist/` and `coverage/`, are also excluded from Git and are omitted from this tree.

## Automated testing

Jest runs unit and API tests. Supertest makes HTTP requests against Express apps. Tests are kept alongside the code they exercise, with shared fixtures and helpers in `tests/`.

### Unit tests

Unit tests cover:

- Controller success, validation, empty-result and failure paths.
- Entry input, integer-string and pagination validation.
- Pagination metadata calculations.
- Route-to-controller wiring.
- Repository results, query parameters and database failures.
- Error responses and delegation when headers have already been sent.
- Readiness controller tests check successful and failed database checks using a mocked repository.

Controller tests mock the repository. Repository tests exercise the real repository with a mocked `database.execute`.

Tests use Arrange–Act–Assert. Suites with shared Jest mocks reset them before each test and configure the behaviour needed for that scenario. ESM module mocks are registered before dynamically importing the module under test.

Run unit tests:

```bash
npm run unit-test
```

### API tests

API tests check entry endpoints, server health and database readiness, security headers and rate limiting. They cover successful requests, pagination, empty results, invalid input, content-length limits, invalid or unsafe entry IDs, missing entries and unexpected failures. Request-parsing tests cover malformed JSON, oversized bodies and unsupported content encoding.

Entry endpoint tests send requests through the configured application with the repository mocked. Rate-limiter tests use a fresh, small Express app and limiter for each scenario.

Assertions check HTTP status and response bodies, plus relevant repository interactions such as avoiding persistence for invalid requests.

Readiness API tests check route wiring, response bodies and HTTP statuses using a mocked database.

Run API tests:

```bash
npm run api-test
```

Run unit and API tests sequentially:

```bash
npm test
```

### Test coverage

Run all tests together with coverage:

```bash
npm run test:coverage
```

The command produces a terminal table, an HTML report at `coverage/index.html`, and JSON coverage data.

Coverage includes application JavaScript under `src/`, including files not imported by tests. Test files are excluded from measurement. Generated reports are excluded from Git.

The combined report includes code exercised by both unit and API tests. Validation covered by unit tests contributes even when API tests do not exercise every validation case.

Controllers, helpers, middleware, repositories, routes and validation files must each achieve 100% statement, branch, function and line coverage. The coverage command fails if these thresholds are not met; `npm test` alone does not enforce them.

`src/server.js` and `src/scripts/test-db-connection.js` remain visible as automated coverage gaps, without a coverage threshold.

Separate unit-only or API-only coverage runs can be useful for investigation, but write to the same report directory and may fail thresholds for code that the selected suite does not exercise. Use the combined command for the project coverage check.

### Testing scope

Automated tests do not verify SQL execution, schema compatibility or persistence against a real MySQL database. Manual database and API checks complement the mocked suite.

Coverage shows which code executed, not whether every behaviour is correct. Executing database configuration code does not prove a real connection worked.

Failure-path tests may print expected console errors while passing. Read the assertions and final test result to distinguish expected logging from a failed test.

See the [testing guide](documentation/testing.md) for additional conventions and examples.

## Continuous integration

The workflow in `.github/workflows/quality-checks.yml` runs on pull requests targeting `main`, pushes to `main` and manual runs.

It uses Node.js 24 on an Ubuntu 24.04 runner to:

1. Install dependencies from the lockfile with `npm ci`.
2. Check formatting with Prettier.
3. Lint code with ESLint.
4. Run unit and API tests with coverage thresholds.
5. Build the server with Webpack.
6. Generate JSDoc documentation.

The current suite does not need a MySQL service or database credentials in CI.

Results are available in the pull request's Checks tab or the repository's Actions tab. Blocking merges on failed checks additionally requires the job to be configured as a required status check in repository settings.

## Manual API testing

Start the server using the two-terminal development workflow or `npm run build` followed by `npm start`.

Use `api-requests.http` with a compatible VS Code HTTP client extension, or send requests with Postman. Use the API reference above for pagination and response examples.

Useful manual checks include:

- Default and requested entry pages.
- Valid entry creation and content trimming.
- Invalid category, content and pagination values.
- Random selection.
- Deleting an existing or missing entry.
- `GET /health`.
- `GET /ready` returns `200` with MySQL running.
- Stop MySQL: `/ready` returns `503`, while `/health` still returns `200`.
- Restart MySQL: `/ready` returns `200` again.
- Malformed JSON responses.

Morgan prints request method, URL, status and response time in the server terminal. Controllers log operations; the central error handler logs unexpected failures. The readiness controller logs failed database checks and returns `503`.

## Documentation

Generate the HTML documentation:

```bash
npm run docs
```

Open `docs/index.html` in a browser.

The generated documentation includes:

- This README as its homepage.
- The testing guide from `documentation/testing.md`.
- A reference generated from JSDoc comments in application source files.

The configuration is maintained in `jsdoc.config.json`. Guide sources live in `documentation/`; generated output lives in `docs/` and is excluded from Git.

Test source files are excluded from the function reference. The testing guide explains their organisation, scope and conventions.

## Available scripts

| Command                 | Purpose                                                 |
| ----------------------- | ------------------------------------------------------- |
| `npm run dev`           | Build with Webpack and watch source changes             |
| `npm run dev:server`    | Run the bundle with Nodemon and restart when it changes |
| `npm run build`         | Generate `dist/server.cjs`                              |
| `npm start`             | Run the built server without watching                   |
| `npm run db:test`       | Check the configured MySQL connection                   |
| `npm test`              | Run unit tests followed by API tests                    |
| `npm run unit-test`     | Run tests excluding `.api.test.js` files                |
| `npm run api-test`      | Run `.api.test.js` files                                |
| `npm run test:coverage` | Run all tests together and enforce coverage thresholds  |
| `npm run lint`          | Check JavaScript with ESLint                            |
| `npm run lint:fix`      | Apply available ESLint automatic fixes                  |
| `npm run format`        | Format supported files with Prettier                    |
| `npm run format:check`  | Check formatting without changing files                 |
| `npm run docs`          | Generate HTML documentation                             |

## Engineering goals

This project provides a focused environment for practising:

- REST API design with Node.js and Express.
- Separation of routes, controllers, repositories, validation and configuration.
- Useful extraction of shared rules, fixtures and helpers.
- Input validation and predictable HTTP responses.
- Parameterised SQL and persistent storage.
- Pagination and consistent result ordering.
- Unit and API tests with Jest and Supertest.
- Dependency mocking and success, edge and failure-path testing.
- Coverage reporting and thresholds.
- Central error handling, request logging and security middleware.
- Documentation and automated quality checks.

The API uses Express REST routes to strengthen my understanding of HTTP, middleware and data persistence before exploring GraphQL.

## Next steps

- Review the architecture, logging and testing approach.
- Add integration tests against a dedicated MySQL test database.
- Add user authentication and entry ownership.
- Build an accessible frontend.
- Add end-to-end tests for complete user journeys.

## Future ideas

- Filter entries by category or date.
- Edit existing entries.
- Select daily, weekly or monthly reflection prompts.
- Mark entries as favourites or export them.
- Integrate positive quotations from an external API.
- Explore a hand-drawn or retro-inspired visual theme.
