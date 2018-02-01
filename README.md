# Starter
**Starter** is a react ssr enabled starter kit (SSR | Universal | Isomorphic).

[![Build Status](https://travis-ci.org/ItsMrAkhil/starter.svg?branch=master)](https://travis-ci.org/ItsMrAkhil/starter)
[![dependencies Status](https://david-dm.org/itsMrAkhil/starter/status.svg)](https://david-dm.org/itsMrAkhil/starter)
[![devDependencies Status](https://david-dm.org/itsMrAkhil/starter/dev-status.svg)](https://david-dm.org/itsMrAkhil/starter?type=dev)

#### Features
  - HMR (Hot Module Replace) enabled (Even SSR Enabled) in dev mode (Cool as shit.)
  - [React Hot Loader 4](https://github.com/gaearon/react-hot-loader/tree/next)
  - [React Router V4](https://reacttraining.com/react-router/web/guides/philosophy)
  - [React Redux](https://github.com/reactjs/react-redux)
  - [Redux Thunk](https://github.com/gaearon/redux-thunk)
  - [Express](http://expressjs.com/) as Server
  - Server Side Rendering Enabled
  - Code Splitting using [React-Loadable](https://github.com/thejameskyle/react-loadable)
  - 404 Error codes handling
  - No other view engines only JS (React) based view engine. Even on server side.
  - Auto restart ssr proxy server on code change.
  - ESLint for following better coding standards
  - Import static images inside JS. (file-loader)


> **Note:** This starter is not for those who are new to React.js. In other words it is only for those who knows react well and who wants to create react apps with **Server Side Rendering**

### Usage

Starter requires [Node.js](https://nodejs.org/) v6+ to run.

Clone this repo
```sh
$ git clone https://github.com/ItsMrAkhil/starter
```
Install the dependencies and devDependencies and start the server.

```
$ cd starter
$ npm install
$ npm start
```

For production environment

```sh
$ npm run start:production
```

### Todos

 - Add Jest and Enzyme Testing (PR Welcome)
 - Separate common webpack configurations from webpack config files. And use webpack merge to combine all with the base config (PR Welcome)
 - Add generators for giving the common code for Components, Routes (In Progress)
 - Make Reducers also lazy. Load reducers which are required for the particular route. (PR Welcome, Help required.)

License
----
MIT

**Free Software, F##k Yeah!**
