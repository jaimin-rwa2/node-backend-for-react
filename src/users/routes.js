const express = require("express")
const user = require("./controlers")
const { profileUpload } = require("../config/multerConfig")

const routes = express.Router()

// read
routes.get("/doseEmailExist", user.doseEmailExist)
routes.get("/doseUsernameExist", user.doseUsernameExist)

// 1. read All
routes.get("/", user.getAll)

// 2. read One
routes.get("/:id", user.getOne)

// update
routes.put("/:id", profileUpload.single(""), user.updateOne)

// delete
routes.delete("/:id", user.deleteOne)



module.exports = routes


