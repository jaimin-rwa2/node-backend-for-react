const express = require("express")
const product = require("./controlers")
const { authUser } = require("../auth/middleware")
const { productUploads } = require("../config/multerConfig")


const routes = express.Router()

// read
// 1. read All
routes.get("/", product.getAll)

// 2. read One
routes.get("/:id", product.getOne)

// create
routes.post("/", authUser, productUploads.single("image"), product.createOne)

// update
routes.put("/:id", authUser, productUploads.single("image"), product.updateOne)

// delete
routes.delete("/:id", authUser, product.deleteOne)



module.exports = routes


