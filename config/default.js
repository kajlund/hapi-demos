/**
 * Default i.e. development configuration
 */

"use strict"

const pack = require("../package.json")

module.exports = {
  client: {
    name: pack.name,
    description: pack.description,
    version: pack.version
  },
  db: {
    uri: "$MONGODB_URI",
    options: {
      keepAlive: 300000,
      connectTimeoutMS: 300000,
      useNewUrlParser: true
    }
  },
  logging: {
    level: "warn",
    timeformat: "YYYY-MM-DD HH:mm:ss",
    console: {
      use: true,
      colorize: true,
      level: "silly"
    },
    file: {
      use: true,
      level: "silly"
    }
  },
  webserver: {
    cors: false, // Cross-Origin Resource Sharing ability (true/false)
    env: "$NODE_ENV",
    https: false,
    port: "$PORT::number",
    publicFolder: "",
    tls: false
  }
}
