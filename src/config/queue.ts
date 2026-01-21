import Redis from "ioredis";

const redis = new Redis({
    port : 6379,
    host : '127.0.0.1',
}); 

console.log(`Redis client created and it is connected to host : ${redis.options.host}`);

redis.set("emailQueue", "hello this is a test email");
redis.get("emailQueue").then((result: string | null) => {
    console.log(result);
}).catch((err: Error) => {
    console.error(err);
}).finally(() => {
    redis.disconnect();
});
