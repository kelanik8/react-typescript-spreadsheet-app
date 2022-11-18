# Very Good Spreadsheet

A spreadsheet component written in TypeScript and React.
It supports displaying and updating data as well as formulas containing arithmetic and cell references.


## Requirements

- Node v12.14.0+
- Yarn


## Setup

The first step is to `yarn install` all dependencies.
Once completed, the [package.json](package.json) file contains scripts to test, run and build the application.

For example running `yarn run start` starts the development server in watch mode.
After that you can visit [http://localhost:1234](http://localhost:8080) to see the application running.
Any file changes will automatically be reloaded.

Tests can be run with `yarn run test` which can also take an optional file path to run a single test file.

Lastly, all files can be linted with `yarn run lint`.

## Build

The production version of the code can be build with `yarn run build`.
It will place the resulting files in the directory `build/release`.
