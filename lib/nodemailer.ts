import nodemailer from "nodemailer"

const emailUser = process.env.EMAIL_USER
const emailPass = process.env.EMAIL_PASS

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emailUser,
        pass: emailPass,
    },
})

export const mailOptions = {
    from: emailUser,
    // You can set a default 'to' here or override it in individual calls
}
