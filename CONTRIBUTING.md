## Prerequisites

[Node.js](http://nodejs.org/) >= v4 must be installed.

## Installation

- Running `yarn install` in the component's root directory will install everything you need for development.

## Documentation and development Server

- `yarn run dev` will run a development server with the lib's documentation app at [http://localhost:3000](http://localhost:3000) with hot module reloading.

Documentation is written using MDX with *docz*.

## Running Tests

- `yarn test` will run the tests once.

- `yarn run test:coverage` will run the tests and produce a coverage report in `coverage/`.

- `yarn run test:watch` will run the tests on every change.

## Building

- `yarn run build` will build the lib for publishing to npm.

- `yarn run clean` will delete built resources.
