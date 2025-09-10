const nodemailer = require("nodemailer")


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.emailId,
        pass: process.env.emailPass,
    },
})


const sendEmail = async (userEmail, otp) => {

    const mailOptions = {
        from: process.env.emailId,
        to: userEmail,
        subject: "Verification for OTP",
        html: `<h1 style="color: cyan;">This is you OTP : ${otp}</h1>`
    }

    await transporter.sendMail(mailOptions)
}

module.exports = { sendEmail }