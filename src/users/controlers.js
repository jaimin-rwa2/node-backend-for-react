const User = require("./model")

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
        const username = req.params["username"]
        const user = await User.findOne({ username: username })

        if (user) res.status(409).json({ msg: "username exist" })

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
        const email = req.params["email"]
        const user = await User.findOne({ email: email })

        if (user) res.status(409).json({ msg: "email exist" })

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

        await User.findOneAndUpdate({ _id: id }, { contectNo, email })

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
        await User.findByIdAndDelete(id)
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