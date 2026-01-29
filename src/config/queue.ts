import Redis from "ioredis";
import { processEmailQueue } from "./emailWorker";

//this was me first time trying to find out how redis works   
// trying to setup a redis client 
// redis.set("emailQueue", "hello this is a test email");
// redis.get("emailQueue").then((result: string | null) => {
//     console.log(result);
// }).catch((err: Error) => {
//     console.error(err);
// }).finally(() => {
//     redis.disconnect();
// });

class Queue {
    private redis: Redis;
    private queueName: string;

    constructor(redis: Redis, queueName: string) {
        this.redis = redis;
        this.queueName = "emailQueue";
    }

 //now we need to add functions which we can 
  async addEmailToQueue(email: string, subject: string): Promise<void> {
    await this.redis.lpush(
        this.queueName,
        JSON.stringify({ email, subject, createdAt: new Date().toISOString() })
    );
  }

  async startProcessing(): Promise<void> {
    console.log("Starting email processing...");
    processEmailQueue();
  }

  async getQueueLength(): Promise<number> {
    return await this.redis.llen(this.queueName);
  }

    
}

export { Queue };