"use strict"

const Path = require("path")

const Glue = require("glue")
const Config = require("getconfig")
const Log = require("@attracs/logger-winston-configured")
const NuxtConfig = require("./nuxt.config")

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
    plugins: [{ plugin: require("hapi-nuxt"), options: NuxtConfig }]
  }
}

const start = async () => {
  try {
    Log.info("Composing server...")
    server = await Glue.compose(
      manifest,
      { relativeTo: Path.join(__dirname, "modules") }
    )

    // Add API
    await server.route({
      path: "/api",
      method: "GET",
      handler: () => {
        return { works: true }
      }
    })

    Log.info("Starting server...")
    await server.start()
    Log.info(`Server running at: ${server.info.uri}`)
    // const { nuxt, builder } = server.plugins.nuxt
  } catch (err) {
    Log.error("Error starting server", err)
    process.exit(1)
  }
}

process.on("uncaughtException", err => {
  Log.error("Uncaught Exception", err)
  process.exit(1)
})

process.on("unhandledRejection", reason => {
  Log.error("Unhandled Rejection at:", reason.stack || reason)
  process.exit(1)
})

// listen on SIGINT signal and gracefully stop the server
process.on("SIGINT", async () => {
  Log.warn("SIGINT Signal Received - Stopping Server")
  try {
    await server.stop({ timeout: 10000 })
    Log.warn("Hapi server stopped")
    process.exit(0)
  } catch (err) {
    Log.error("Exception thrown trying to close server", err)
    process.exit(1)
  }
})

start()
