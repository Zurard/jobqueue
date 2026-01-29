// console.log("what the hell is this ") // to check if the file is getting loaded
import { Queue } from "./config/queue"
import Redis from "ioredis";

type user = {
    email: string,
    password: string
}

const redis = new Redis();
const emailQueue = new Queue(redis, "email");

const Login = async ( user : user) => {
    const email = user.email
    const password = user.password
    console.log(`email:  ${email}`);
    console.log(`password: ${password}`);
    
    // Add email to queue (non-blocking, returns immediately)
    await emailQueue.addEmailToQueue(email, "Welcome to our service!");
    await emailQueue.startProcessing();
    console.log("✅ Email added to queue! Worker will process it.");
}

(async () => {
    await Login({
        email: 'shreetejmeshram07@gmail.com',
        password: 'password123'
    });
    
    // Keep server running so worker can process emails
    console.log("🚀 Server running...");
})();
