import nodemailer from "nodemailer";


const emailService = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    auth: {
        user: "user@example.com",
        pass: "password"
    }
});
