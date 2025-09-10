const User = require("../users/model")
const Product = require("./model")
const path = require("path")
const fs = require("fs")

const getAll = async (req, res) => {
    try {
        const products = await Product.find().populate("user", "username ")

        return res.status(200).json({
            data: products
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error
        })
    }
}

const getOne = async (req, res) => {

    try {
        const id = req.params["id"]
        const product = await Product.findOne({ _id: id })
        if (!product) return res.status(404).json({ msg: "product not found" })
        return res.status(200).json({ data: product })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error
        })
    }
}

const createOne = async (req, res) => {
    try {

        let file = ""
        if (req.file?.filename) {
            file = req.file.filename
        }

        const user_id = req.user.id
        const user = await User.findById(user_id)

        const { name, price, desc, catagory, discount_data, color } = req.body;
        if (!name || !price || !catagory) return res.status(422).json({ msg: "data require" })
        const product = await Product.create({ name, price, desc, catagory, discount_data, color, user: user_id, image: file })
        user.products.push(product._id)
        await user.save()
        return res.status(201).json({ msg: "Product Created." })
        // res.contentType('image/jpeg').send(Buffer.from(req.file.buffer, 'binary'))
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error
        })
    }
}

const updateOne = async (req, res) => {
    try {
        const id = req.params["id"]
        const product = await Product.findById(id)
        if (!product) return res.status(404).json({ msg: "product not found" })

        let file = product.image
        let oldFile = ""
        if (req.file?.filename) {
            oldFile = file
            file = req.file.filename
        }

        const { name, price, desc, catagory, discount_data, color } = req.body;

        await Product.findOneAndUpdate({ _id: id }, { name, price, desc, catagory, discount_data, color, image: file })
        // User.findByIdAndUpdate(id, { username, password, contectNo, email })

        if (oldFile) {
            file_path = path.join(__dirname, "..", "..", "public", "products", product.image)
            fs.unlinkSync(file_path)
        }

        return res.status(200).json({ msg: "product updated successfuly" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error
        })
    }

}

const deleteOne = async (req, res) => {
    try {
        const id = req.params["id"]
        const product = await Product.findById(id)
        if (!product) return res.status(404).json({ msg: "product not found" })

        let file_path = ""
        if (product.image) {
            file_path = path.join(__dirname, "..", "..", "public", "products", product.image)
        }

        await Product.findByIdAndDelete(id)

        if (product.image) {
            fs.unlinkSync(file_path)
        }

        res.status(200).json({ msg: `User Deleted Successfuly` })
    } catch (error) {

        // check if product deleted, product image remove kari pade

        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error
        })
    }
}

module.exports = { getAll, getOne, createOne, deleteOne, updateOne }