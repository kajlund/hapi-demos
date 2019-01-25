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
    plugins: [{ plugin: require("hapi-auth-cookie") }]
  }
}

const main = async () => {
  try {
    const server = await Glue.compose(
      manifest,
      { relativeTo: __dirname }
    )

    server.auth.strategy("session", "cookie", {
      password: "password-should-be-32-characters",
      cookie: "sid-example",
      // redirectTo: '/login',
      isSecure: process.env.NODE_ENV === "production"
    })

    server.route({
      method: "GET",
      path: "/public",
      config: {
        auth: false,
        handler: () => {
          return { message: "The public route is for everybody" }
        }
      }
    })

    server.route({
      method: "GET",
      path: "/private",
      config: {
        auth: { mode: "try", strategy: "session" },
        handler: request => {
          if (request.auth.isAuthenticated) {
            // session data available
            // const session = request.auth.credentials
            return { message: `Welcome ${request.auth.credentials.username}! You have access to our private data` }
          }
          return { message: "The private route is for authenticated users only" }
        }
      }
    })

    server.route({
      method: "POST",
      path: "/login",
      config: {
        handler: async request => {
          let user

          if (request.auth.isAuthenticated) {
            return { message: "Yo! You dawg already authenticated." }
          }

          const username = request.payload.username
          const pwd = request.payload.password

          try {
            // check if user exists in DB
            user = await User.findOne({ username })
            if (!user) {
              throw new Error(`Invalid username ${username} tried to logon`)
            }

            // compare passwords
            const isValid = await Bcrypt.compare(pwd, user.password)
            if (!isValid) {
              throw new Error(`User ${username} tried to logon with invalid pwd: ${pwd}`)
            }

            const { password, ...credentials } = user // remove pwd from User obj
            request.cookieAuth.set(credentials)
          } catch (err) {
            console.error(err.stack)
            throw Boom.unauthorized()
          }

          return { message: `Welcome ${user.username}` }
        }
      }
    })

    server.route({
      method: "GET",
      path: "/logout",
      config: {
        auth: "session",
        handler: request => {
          // clear the session data
          request.cookieAuth.clear()
          return { message: "User logged out" }
        }
      }
    })

    console.log("Starting server")
    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
