"use strict"

const users = [
  {
    id: 1,
    username: "admin",
    password: "$2a$12$WscO.WYuvwuEbQFe1cRkqu6DSOnogcpj5uIhaZxRbY3RwptSrQOti", // secret
    isAdmin: true
  },
  {
    id: 2,
    username: "user",
    password: "$2a$12$Cmtp4ez/wrCkXX34u1EtPej6ll/l1A.Ag0Vv2NN9comb/ueXsD60.", // user
    isAdmin: false
  }
]

class User {
  static findOne(qry) {
    return new Promise(resolve => {
      const user = users.find(usr => usr.username === qry.username)
      if (user) {
        return resolve(user)
      }
      resolve(null)
    })
  }
}

module.exports = {
  User
}
