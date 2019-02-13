"use strict"

module.exports = function(context) {
  let admin = false
  const hasRole = context && context.data && context.data.root && context.data.root.user && context.data.root.user.role
  if (hasRole) {
    const role = context.data.root.user.role
    admin = role.length ? role.indexOf("admin") > -1 : role === "admin"
  }

  if (admin) {
    return context.fn(this)
  } else {
    return context.inverse(this)
  }
}
