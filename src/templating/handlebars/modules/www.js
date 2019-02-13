/**
 * Created by LuKa on 2019-01-02.
 * Web module
 */

"use strict"

const Path = require("path")

const Boom = require("boom")

const name = "www"
const version = "1.0.0"

const pathPublic = Path.resolve(__dirname, "../", "public")
const viewsPath = Path.resolve(pathPublic, "views")

const register = async server => {
  server.log("info", `Registering plugin ${name} v.${version}`)
  server.dependency(["inert", "vision"])

  server.views({
    engines: { hbs: require("handlebars") },
    context: () => {
      return {
        description: "Handlebars Demo",
        title: "HDemo",
        version: "1.0.0",
        year: new Date().getFullYear()
      }
    },
    path: viewsPath,
    layout: true,
    layoutPath: Path.resolve(viewsPath, "layouts"),
    partialsPath: Path.resolve(viewsPath, "partials"),
    isCached: process.env.NODE_ENV === "production",
    helpersPath: Path.resolve(viewsPath, "helpers")
  })

  server.route([
    {
      method: "GET",
      path: "/",
      handler: async (request, h) => {
        return h.view("index", {
          pageTitle: "Home",
          message: "This is the home page",
          context: "home",
          user: { role: ["user"] }
        })
      }
    },
    {
      method: "GET",
      path: "/about",
      handler: async (request, h) => {
        return h.view("about", {
          pageTitle: "About",
          message: "This is the about page",
          context: "about",
          user: { role: ["user"] }
        })
      }
    },
    {
      method: "GET",
      path: "/js/{path*}",
      config: {
        handler: { directory: { path: Path.resolve(pathPublic, "js") } }
      }
    },
    {
      method: "GET",
      path: "/css/{path*}",
      config: {
        handler: { directory: { path: Path.resolve(pathPublic, "css") } }
      }
    },
    {
      method: "GET",
      path: "/img/{path*}",
      config: {
        handler: { directory: { path: Path.resolve(pathPublic, "img") } }
      }
    },
    // Anything else gets a 404
    {
      method: ["GET", "POST"],
      path: "/{path*}",
      config: {
        handler: (request, h) => {
          const accept = request.headers.accept

          if (accept && accept.match(/json/)) {
            return Boom.notFound("Resource not found.")
          }

          return h.view("404", null, { layout: "hero" }).code(404)
        }
      }
    }
  ])
}

exports.plugin = { register, name, version }
