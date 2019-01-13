/**
 * MongoDB connection and models plugin
 */

"use strict"

const Mongoose = require("mongoose")
// Mongoose to use ES6 promises
Mongoose.Promise = global.Promise

// const Book = require('./book') // import models

const name = "db"
const version = "1.0.0"

const register = async (server, cnf) => {
  let conn = null

  console.log(`Registering plugin ${name} v.${version}`)

  // Connect to your database
  try {
    conn = await Mongoose.connect(
      cnf.uri,
      cnf.options
    )
    console.log("✅ MongoDB connected")
    server.app.db = conn.db
    // server.app.models = { Book } // assign models
  } catch (err) {
    console.error(`⚡️ 🚨 ⚡️ 🚨 ⚡️ 🚨 ⚡️ 🚨 ⚡️ 🚨  → ${err.message}`)
    throw err
  }
}

exports.plugin = { register, name, version }
