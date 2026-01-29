import Redis from "ioredis";
import nodemailer from "nodemailer"
import dotenv from "dotenv";

// Load .env file
dotenv.config();

const redis = new Redis();

const QUEUE_NAME = "emailQueue";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export async function processEmailQueue() {
    console.log("Processing the email queue");
    while (true) {
        const result   = await redis.brpop(QUEUE_NAME, 0);
        if (!result) continue
        const [, jobData] = result;
        const { email, subject} = JSON.parse(jobData);

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject,
                html: `
                    <h1>${subject}</h1>
                    <p>Thank you for signing up!</p>
                    <p>This email was sent from our queue system.</p>
                    <p>Sent at: ${new Date().toISOString()}</p>
                `,
                text: "Thank you for signing up!"
            });
            console.log(`Email sent to ${email}`);
        } catch (error) {
            console.error(`Error sending email to ${email}:`, error);
            await redis.lpush(QUEUE_NAME, jobData);
        }
    }
}



