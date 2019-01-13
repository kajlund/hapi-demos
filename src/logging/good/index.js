"use strict"

const Glue = require("glue")

let server

const goodOptions = {
  reporters: {
    consoleReporter: [
      {
        module: "good-squeeze",
        name: "Squeeze",
        args: [{ log: "*", response: "*", request: "*" }]
      },
      {
        module: "good-console"
      },
      "stdout"
    ]
  }
}

const manifest = {
  server: {
    host: "localhost",
    port: 3000
  },
  register: {
    plugins: [{ plugin: require("good"), options: goodOptions }]
  }
}

const main = async () => {
  try {
    server = await Glue.compose(
      manifest,
      { relativeTo: __dirname }
    )

    await server.start()
    server.log("info", "Server running at: " + server.info.uri)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
