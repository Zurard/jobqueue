import Redis from "ioredis";

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
        this.queueName = "dukaron";
    }

 //now we need to add functions which we can 
  async addEmailToQueue(email: string, subject: string): Promise<void> {
    await this.redis.lpush(
        this.queueName,
        JSON.stringify({ email, subject, createdAt: new Date().toISOString() })
    );
  }

  // now we need to process the email queue
  async processEmailQueue(): Promise<void>{
    const emailData = await this.redis.rpop(this.queueName);
    if (emailData) {
      const { email, subject } = JSON.parse(emailData);
      console.log(`Sending email to: ${email} with subject: ${subject}`);
      // Here you would integrate with your email sending service
    }
  }

  async getQueueLength(): Promise<number> {
    return await this.redis.llen(this.queueName);
  }

  async getAll() {
    const jobs = await this.redis.lrange(this.queueName, 0, -1);
    return jobs.map(job => JSON.parse(job));
  }
    
}

export { Queue };