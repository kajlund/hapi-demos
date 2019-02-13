"use strict"

const isContext = function(option, viewdata) {
  const currentContext = viewdata.data.root.context

  if (option == currentContext) {
    return viewdata.fn(this)
  } else {
    return viewdata.inverse(this)
  }
}

module.exports = isContext
