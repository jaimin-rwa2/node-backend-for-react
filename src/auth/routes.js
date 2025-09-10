const express = require("express")
const user = require("./controlers")
const { authUser } = require("./middleware")

const routes = express.Router()

routes.post("/register", user.register)
routes.post("/registerVerifyOtp", user.registerVerifyOtp)
routes.post("/login", user.login)
routes.post("/sendOtp", user.sendOTP)
routes.post("/verifyOtp", user.verifyOtp)
routes.post("/forgotpassword", user.forgotpassword)
routes.post("/resetpassword", authUser, user.resetpassword)
routes.post("/logout", user.logout)

module.exports = routes