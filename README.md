# Hapi Demos

Linting dependencies added att root folder level:

```bash
npm i -D eslint eslint-config-prettier eslint-plugin-prettier eslint-watch prettier
```

Small tweaks in .prettierrc and .eslintrc.json. The .editorconfig set for 2-space-indent anf lf linefeeds. Many projects will use `getconfig` to load env variables and configs.


## Authorization

Authentication in hapi is based on **schemes** and **strategies**. A scheme is the type of authentication used, like basic or bearer whereas a strategy is a configured and named instance of a particular scheme: `server.auth.strategy(name, scheme, [mode], options)`.

You can register multiple strategies for the same server. A strategy can apply to all routes or be set separately for each route via the route config object.

### Basic

Basic authorization sends username and password in the header with every request and therefore should not be used in general. With Hapi you can use [hapi-auth-basic](https://github.com/hapijs/hapi-auth-basic) a basic authentication plugin. A demo app using basic auth can be found in `src/auth/basic/index.js`.

### Cookie-Based

For cookie auth you can use the [hapi-auth-cookie](https://github.com/hapijs/hapi-auth-cookie) plugin. You can find a demo app in `src/auth/cookie/index.js`. The cookie scheme can, but is not obligated to, have a validate method. That method could be used for disallowing users with valid cookies if need be. Hapi's `request.auth` object provides the additional boolean attribute `isAuthenticated`. If isAuthenticated the `request.auth.credentials` will typically contain user data.

## Databases

### Mongoose Connection

Sample demos how to connect to a MongoDB database using the Mongoose ODM. You can find it at `src/db/mongoose/index.js`.

The sample adds the `db` section to config:

```js
db: {
  uri: "$MONGODB_URI",
  options: {
    keepAlive: 300000,
    connectTimeoutMS: 300000,
    useNewUrlParser: true
  }
},
```

The uri value `$MONGODB_URI` intructs getconfig to read the environment variable `MONGODB_URI`. You can add something like `MONGODB_URI=mongodb://localhost:27017/Hapi-Demos` to a .env file in the project root dir.

> TODOs: Could add a model or two and some samples on how to use Monggose.

## Logging

Logging with Hapi is traditionally done using [Good](https://github.com/hapijs/good). The [good-file](https://github.com/hapijs/good-file) has been discontinued...

A sample using Good is provided in `src/logging/good/index.js`.

## Templating

Weak area for me as I've always used Hapi to build REST endpoints for SPAs.

A sample of using [Handlebars](https://handlebarsjs.com/) is found at `src/templating/handlebars/index.js`.

A sample of using the [hapi-nuxt](https://github.com/nuxt-community/hapi-nuxt) plugin supporting the [Nuxt.js](https://nuxtjs.org/) Vue.js framework is found at `src/templating/nuxt/index.js`.

### ToDos

* Document Hapi/Good process monitoring vs Logging
* Provide alternative logger using Winston
* Build plugin for using Winston logger for process monitoring/logging
