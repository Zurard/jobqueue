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
    
    // Add email to queue
    await emailQueue.addEmailToQueue(email, "Welcome to our service!");
}

Login({
    email: 'shreetejmeshram07@gmail.com',
    password: 'password123'
})

