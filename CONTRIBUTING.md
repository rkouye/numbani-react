## Prerequisites

[Node.js](http://nodejs.org/) >= v4 must be installed.

## Installation

- Running `npm install` in the component's root directory will install everything you need for development.

## Documentation and development Server

- `npm run dev` will run a development server with the lib's documentation app at [http://localhost:3000](http://localhost:3000) with hot module reloading.

Documentation is written using MDX with *docz*.

## Running Tests

- `npm test` will run the tests once.

- `npm run test:coverage` will run the tests and produce a coverage report in `coverage/`.

- `npm run test:watch` will run the tests on every change.

## Building

- `npm run build` will build the lib for publishing to npm.

- `npm run clean` will delete built resources.
