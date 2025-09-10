const { sendEmail } = require("../config/emailConfig");
const { USER_ROLES } = require("../users/const");
const User = require("../users/model");
const { validate } = require("../users/validation");
const bcrypt = require('bcrypt');
const saltRounds = process.env.bycrypt_solt;
const OTP_STORE = {}

const register = async (req, res) => {
    try {

        let file = ""
        if (req.file?.filename) {
            file = req.file.filename
        }


        const { username, password, email, role } = req.body;

        if (role === USER_ROLES.ADMIN) return res.status(403).json({ msg: "You cannot register as an admin" });

        const hashedPassword = bcrypt.hashSync(password, saltRounds)

        await User.create({ username, password: hashedPassword, email, roles: role, image: file });

        let otp = ""

        for (let i = 1; i <= 4; i++) {
            otp += Math.floor(Math.random() * 10)
        }

        sendEmail(email, otp)

        OTP_STORE[email] = { otp: otp, isVerified: false }

        return res.status(201).json({ msg: "User Registered and verify email." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error
        })
    }
}


const login = async (req, res) => {
    try {

        const { identifier, password } = req.body

        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        })

        if (!user) return res.status(404).json({ msg: "user not found" })

        const isPasswordOk = bcrypt.compareSync(password, user.password)
        if (!isPasswordOk) return res.status(401).json({ msg: "password Wrong" })

        if (!user.verified) return res.status(403).json({ msg: "can not login, please verify user" })

        // session create
        req.session.user = { id: user._id, username: user.username }

        return res.status(200).json({ msg: "login sucessfull" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error
        })
    }
}

const registerVerifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email) return res.status(422).json({ msg: "email fild is require" })

    const user = await User.findOne({ email: email })

    if (!user) return res.status(404).json({ msg: "not valid email id" })

    if (OTP_STORE[email]["otp"] !== otp) return res.status(401).json({ msg: "wrong OTP" })

    user.verified = true;

    user.save()

    delete OTP_STORE[email];

    res.status(200).json({ msg: "OTP verified successfully" })
}


const logout = (req, res) => {
    try {
        req.session.destroy()
        return res.status(200).json({ msg: "logout sucessfull" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error
        })
    }
}

const resetpassword = async (req, res) => {
    const userId = req.user["id"]

    const { password, newPassword } = req.body;

    if (!password || !newPassword) return res.status(422).json({ msg: "password and newPassword fild are require" })

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ msg: "user not found" })

    const isMatch = bcrypt.compareSync(password, user.password)

    if (!isMatch) return res.status(401).json({ msg: "Please enter conrrect password" })

    user.password = bcrypt.hashSync(newPassword, saltRounds)

    await user.save()

    res.status(200).json({
        msg: "password updated succesfully"
    })
}



const sendOTP = (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(422).json({ msg: "email fild is require" })

    const isUser = User.exists({ email: email })

    if (!isUser) return res.status(404).json({ msg: "not valid email id" });

    let otp = ""

    for (let i = 1; i <= 4; i++) {
        otp += Math.floor(Math.random() * 10)
    }

    sendEmail(email, otp)

    OTP_STORE[email] = { otp: otp, isVerified: false }

    return res.status(200).json({
        msg: "email sent succesfully",
        otp: otp
    })
}

const verifyOtp = (req, res) => {
    const { email, otp } = req.body;

    if (!email) return res.status(422).json({ msg: "email fild is require" })

    if (OTP_STORE[email]["otp"] !== otp) return res.status(401).json({ msg: "wrong OTP" })

    OTP_STORE[email]["isVerified"] = true

    res.status(200).json({ msg: "OTP verified successfully" })
}

const forgotpassword = async (req, res) => {
    const { email, password, againPassword } = req.body

    if (!OTP_STORE[email]?.isVerified) return res.status(403).json({ msg: "you can not change password" })

    if (password !== againPassword) return res.status(401).json({ msg: "password dose not match" })

    const user = await User.findOne({ email: email })
    if (!user) return res.status(404).json({ msg: "user not found" })

    user.password = bcrypt.hashSync(password, saltRounds)

    await user.save()

    delete OTP_STORE[email];

    res.status(200).json({ msg: "password updated successfully" })

}



module.exports = { register, login, logout, resetpassword, forgotpassword, sendOTP, verifyOtp, registerVerifyOtp }