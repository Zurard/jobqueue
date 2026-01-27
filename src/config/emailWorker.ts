import Redis from "ioredis";
import nodemailer from "nodemailer"
import { Queue } from "./queue";            

const redis = new Redis();

const QUEUE_NAME = "emailQueue";

const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false,
    auth: {
        user: "your-email@example.com",
        pass: "your-email-password"
    }
});

 export async function processEmailQueue() {
    console.log("Processing the email queue");
    while (true) {
        const result   = await redis.brpop(QUEUE_NAME, 0);
        if (!result) continue
        const [, jobData] = result;
        const { email, subject, body } = JSON.parse(jobData);

        try {
            await transporter.sendMail({
                from: "your-email@example.com",
                to: email,
                subject,
                text: body
            });
            console.log(`Email sent to ${email}`);
        } catch (error) {
            console.error(`Error sending email to ${email}:`, error);
            await redis.lpush(QUEUE_NAME, jobData);
        }

    }
}

processEmailQueue();


