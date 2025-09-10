const mongoose = require("mongoose")
const { USER_ROLES } = require("./const")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide unique Username"],
        unique: [true, "username already exists"],
    },
    password: {
        type: String,
        unique: false,

    },
    contectNo: Number,
    email: {
        type: String,
        required: true,
        unique: true,

    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    roles: { type: Number, enum: [USER_ROLES.ADMIN, USER_ROLES.BUYER, USER_ROLES.SELLER], default: USER_ROLES.BUYER },
    verified: { type: Boolean, default: false },
    image: { type: String, default: "" }
})


const User = mongoose.model("User", userSchema)

module.exports = User;
