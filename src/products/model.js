const mongoose = require("mongoose")


const productSchema = new mongoose.Schema({
    name: { type: String, required: true, lowercase: true, trim: true },
    price: Number,
    desc: String,
    ratting: { type: Number, enum: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5], default: 0 },
    catagory: { type: String, enum: ["gadgets", "health", "pet products", "jewellery", "others"] },
    discount: { type: Number, default: 1 },
    discount_data: { type: Date },
    color: { type: [String] },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    image: String
})


const Product = mongoose.model("Product", productSchema)

module.exports = Product

