# Platformer Starter for PixiJS

This project contains basic starter code for games using [TypeScript](https://www.typescriptlang.org/)
with [PixiJS](https://pixijs.com/) and some additional code for an examplary platformer.
It aims to simplify starting a new project and accelerate their development.

This project uses [Webpack](https://webpack.js.org/) to bundle source code, dependencies and assets,
both during development and for a production-ready build. It uses [ESLint](https://eslint.org/) and its
TypeScript-plugin [typescript-eslint](https://typescript-eslint.io/) to lint and improve the source code.


## Getting started

You will need to install [node](https://nodejs.org) including [npm](https://www.npmjs.com/).
Some IDE supporting TypeScript, e.g. `VS Code`, is also a good idea.

Once finished installing the development enviroment install project-specific dependencies with `npm install`.
Then start the development server with `npm start`. This should compile the project and open a browser serving
the current state of the project continiously, even when you change the source code.

## Files to edit

When using this project as a starter for your own game you probably want to edit
the following files:

- [package.json](./package.json): The entrypoint to the project for `npm` containing basic project information.
- [index.ts](./src/index.ts): The main typescript file containing most of the code.
- [index.html](./src/index.html): The main HTML file containing title and author.

## License

This project is licensed under the terms of the [MIT](./LICENSE) licence.
