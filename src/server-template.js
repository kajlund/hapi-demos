"use strict"

const Path = require("path")

const Glue = require("glue")
const Config = require("getconfig")

if (!Config.webserver) {
  throw new Error("No webserver configured")
}

let server

const manifest = {
  server: {
    app: Config,
    host: "localhost",
    port: Config.webserver.port,
    tls: Config.webserver.tls,
    routes: {
      cors: Config.webserver.cors
    }
  },
  register: {
    plugins: [
      // { plugin: require("good"), options: opts }
      // { plugin: require("hapi-auth-basic") }, // providea basic auth
      // { plugin: require("hapi-auth-cookie") }, // providea cookie auth
      // { plugin: require("hapi-auth-jwt2") }, // providea jwt auth
      // { plugin: require('inert') }, // serving folders and files
      // { plugin: require("vision") } // handles templating
      // { plugin: './website', options: Config } // serve site using templates
    ]
  }
}

const start = async () => {
  try {
    console.log("Composing server...")
    server = await Glue.compose(
      manifest,
      { relativeTo: Path.join(__dirname, "modules") }
    )
    console.log("Starting server...")
    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()

process.on("uncaughtException", err => {
  console.error(err.stack)
  process.exit(1)
})

process.on("unhandledRejection", reason => {
  console.log("Unhandled Rejection at:", reason.stack || reason)
  process.exit(1)
})

// listen on SIGINT signal and gracefully stop the server
process.on("SIGINT", async () => {
  console.log("Stopping hapi server")
  try {
    await server.stop({ timeout: 10000 })
    console.log("Hapi server stopped")
    process.exit(0)
  } catch (err) {
    console.error(err.stack)
    process.exit(1)
  }
})
