"use strict"

const Bcrypt = require("bcryptjs")
const Boom = require("boom")
const Glue = require("glue")

const { User } = require("../../users")

const manifest = {
  server: {
    host: "localhost",
    port: 3000
  },
  register: {
    plugins: [{ plugin: require("hapi-auth-basic") }]
  }
}

const main = async () => {
  console.log("Starting server")
  try {
    const server = await Glue.compose(
      manifest,
      { relativeTo: __dirname }
    )

    server.auth.strategy("basic", "basic", {
      validate: async (request, username, pwd) => {
        try {
          const user = await User.findOne({ username })
          if (!user) {
            return { isValid: false }
          }
          const isValid = await Bcrypt.compare(pwd, user.password)
          const { password, ...credentials } = user // remove pwd from User obj
          return { isValid, credentials }
        } catch (error) {
          console.error(error.stack)
          throw Boom.unauthorized()
        }
      }
    })

    server.route({
      method: "GET",
      path: "/private",
      config: {
        auth: "basic",
        handler: () => {
          return {
            message: "This secret message is basically for authenticated users"
          }
        }
      }
    })

    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
  } catch (err) {
    console.error(err.stack)
    process.exit(1)
  }
}

main()
