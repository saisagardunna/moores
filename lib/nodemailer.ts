import nodemailer from "nodemailer"

const emailUser = process.env.EMAIL_USER || "moores1807@gmail.com"
const emailPass = process.env.EMAIL_PASS || "ufgk jjul ncvh vqvx"

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
