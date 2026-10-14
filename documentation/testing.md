# Testing guide

This guide explains how MyJoyJar tests are organised, how to run them,
and the conventions used when writing new tests.

## Running tests

- `npm test`: run all unit and API tests.
- `npm run unit-test`: run unit tests only.
- `npm run api-test`: run API tests only.
- `npm run test:coverage`: run full test and coverage checks.

## Test layers

- Validation tests check accepted inputs, validation errors and boundaries.
- Helper tests check shared utilities such as pagination metadata.
- Repository tests check queries, parameters, returned data and error propagation using a mocked database.
- Controller tests check validation, repository calls and responses using mocked repositories.
- Middleware tests check error responses, logging, delegation, security headers and rate limiting.
- Route tests check that entry endpoints use the intended controllers.
- API tests use Supertest to check HTTP behaviour through Express. Entry API tests mock the repository; readiness API tests mock the database directly.
- `npm run db:test` runs a manual database connectivity check against the configured MySQL instance and closes the connection pool afterwards.

The Jest unit and API suites mock database access. They do not verify a real MySQL connection or execute SQL against MySQL. The database connectivity script checks a real connection, while manual API checks verify application behaviour against the database.

## Test names and ordering

Use descriptive test names that explain the expected behaviour.

Within each suite, put tests in this order:

1. Successful behaviour.
2. Alternative outcomes, invalid inputs and edge cases.
3. Unexpected failures, where relevant.

Pure validation functions do not need a database-failure test.

## Arrange, Act and Assert

Separate each test into three sections:

- Arrange: prepare inputs and configure mocks.
- Act: call the function or make the HTTP request.
- Assert: check the result and relevant interactions.

```js
it('returns an error when content is missing', () => {
  // Arrange
  const input = {
    category: 'gratitude',
  };

  // Act
  const validationErrors = validateEntryInput(input);

  // Assert
  expect(validationErrors).toEqual(['Content is required.']);
});
```

Omit Arrange when the test needs no preparation, such as calling a
validator without an argument.

## Shared fixtures and helpers

Shared test support lives in the root `tests/` directory:

- `mock-entries.js`: stored entries, including IDs and creation dates.
- `mock-entry-inputs.js`: valid and invalid entry input objects.
- `test-helpers.js`: factories for mocked repositories and Express responses.

Reuse fixtures when their values fit the scenario. Keep expected HTTP
status numbers and response messages literal in assertions so tests
independently check the application’s behaviour.

Avoid modifying shared fixtures. When a test needs to change an input,
create a copy first:

```js
const input = {
  ...validEntryInput,
  content: '',
};
```

Object spread creates a shallow copy. Nested objects would still be shared.

## Mock setup

Suites that use shared Jest mocks reset them before each test:

```js
beforeEach(() => {
  jest.resetAllMocks();
});
```

This clears recorded calls and removes mock implementations. Each test
then configures the behaviour it needs.

Create fresh response mocks inside each controller test.

Validation tests do not need mock resets because they use no mocks.

## Error assertions

Repository tests check that database failures pass through as the
original error object:

```js
// Act
const result = entryRepo.getAll({ limit: 10, offset: 0 });

// Assert
await expect(result).rejects.toBe(databaseError);
```

Controller tests check the contextual message and preserved cause:

```js
// Act
const result = getAllEntriesController(req, res);

// Assert
await expect(result).rejects.toThrow(
  'Error fetching all entries: Database unavailable',
);
await expect(result).rejects.toHaveProperty('cause', databaseError);

expect(res.status).not.toHaveBeenCalled();
expect(res.json).not.toHaveBeenCalled();
```

Call the function once and save its promise. Do not await it in the Act
section of a rejection test; await the rejection assertions instead.

API tests check that unexpected failures produce a generic 500 response
without exposing database details.

## Application code constants

Application code uses shared constants for HTTP statuses, response messages
and validation messages. Tests keep expected status numbers and messages
literal so they independently check the API contract. Importing the same
constants into assertions could allow an accidental change to pass unnoticed.

## Logging during tests

Morgan logs HTTP request summaries. The central error handler logs
unexpected request failures. Entry controllers preserve error context
without logging the same failure again. The readiness controller handles
and logs its own database-check failures.

Error-handler unit tests use `jest.spyOn(console, 'error')` to check logging.
An empty mock implementation silences expected output while recording calls.

Create the spy during Arrange, before calling the handler. Restore the
original methods after each test:

````js
afterEach(() => {
  jest.restoreAllMocks();
});

Client-error tests check that the handler does not log an unexpected failure.
Server-error tests check that it logs the context and original error.
Other failure tests may still print expected error logs while passing.

## Before committing

Run:

```bash
npm run format:check
npm run lint
npm test
````

After application or build changes, also run:

```bash
npm run build
```

After documentation changes, regenerate the HTML and inspect the affected
pages:

```bash
npm run docs
```

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
