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
  webserver: {
    cors: false, // Cross-Origin Resource Sharing ability (true/false)
    env: "$NODE_ENV",
    https: false,
    port: "$PORT::number",
    publicFolder: "",
    tls: false
  }
}
