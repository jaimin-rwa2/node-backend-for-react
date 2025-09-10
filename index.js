require('dotenv').config()
const cors = require('cors')
const express = require("express")
const mongoose = require("mongoose")
const session = require('express-session')
const MongoStore = require("connect-mongo")(session);

const app = express()
const PORT = 8000

app.use(cors())
app.use(express.static("public")) // for static files 
app.use(express.json())
app.use(session({
    secret: "put_secret_key",
    resave: false,
    saveUninitialized: true,
    // cookie: { httpOnly: true, sameSite: 'Lax' },
    store: new MongoStore({
        url: 'mongodb://localhost:27017/09_product',
        ttl: 60
    })
}))

app.use("/auth", require("./src/auth/routes"))
app.use("/users", require("./src/users/routes"))
app.use("/products", require("./src/products/routes"))


app.listen(PORT, async () => {
    await mongoose.connect("mongodb://localhost:27017/09_product", { autoIndex: false })
    console.log("DB connected")
    console.log("server started")
})