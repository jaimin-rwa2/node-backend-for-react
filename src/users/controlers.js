const User = require("./model")
const fs = require("fs")
const path = require("path")


const getAll = async (req, res) => {

    try {
        const users = await User.find()
        return res.status(200).json({
            data: users
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error
        })
    }


}

const doseUsernameExist = async (req, res) => {

    try {
        const username = req.query["username"]
        const user = await User.findOne({ username: username })

        if (user) return res.status(409).json({ msg: "username exist" })

        return res.status(200).json({
            msg: "you can create user with this name"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error
        })
    }
}

const doseEmailExist = async (req, res) => {

    try {
        const email = req.query["email"]
        const user = await User.findOne({ email: email })

        if (user) return res.status(409).json({ msg: "email exist" })

        return res.status(200).json({
            msg: "you can create user with this email"
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
        const user = await User.findOne({ _id: id })
        if (!user) return res.status(404).json({ msg: "data not found" })
        return res.status(200).json({ user: user, msg: "user" })
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
        const user = await User.findById(id)
        if (!user) return res.status(404).json({ msg: "user not found" })
        const { contectNo, email } = req.body;

        let file = user.image
        let oldFile = ""
        if (req.file?.filename) {
            oldFile = file
            file = req.file.filename
        }

        await User.findOneAndUpdate({ _id: id }, { contectNo, email, image: file })

        if (oldFile) {
            file_path = path.join(__dirname, "..", "..", "public", "profiles", user.image)
            fs.unlinkSync(file_path)
        }

        return res.status(200).json({ msg: "user updated successfuly" })
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
        const user = await User.findById(id)
        if (!user) return res.status(404).json({ msg: "user not found" })

        let file_path = ""
        if (user.image) {
            file_path = path.join(__dirname, "..", "..", "public", "profiles", user.image)
        }


        await User.findByIdAndDelete(id)

        if (user.image) {
            fs.unlinkSync(file_path)
        }
        return res.status(200).json({ msg: `User Deleted Successfuly` })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error
        })
    }

}

module.exports = { getAll, getOne, deleteOne, updateOne, doseEmailExist, doseUsernameExist }