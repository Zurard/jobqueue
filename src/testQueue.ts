// import { redis, QUEUE_KEY } from "./config/queue";

// const testQueue = async () => {
//     try {
//         // Check Redis connection
//         console.log("🔍 Testing Redis connection...");
//         const pong = await redis.ping();
//         console.log("✅ Redis Response:", pong);

//         // Add multiple test jobs to the queue
//         console.log("\n📧 Adding test email jobs to queue...");
        
//         const emails = [
//             { email: "user1@example.com", subject: "Welcome" },
//             { email: "user2@example.com", subject: "Verification" },
//             { email: "user3@example.com", subject: "Notification" }
//         ];

//         for (const emailJob of emails) {
//             const job = {
//                 ...emailJob,
//                 createdAt: new Date().toISOString(),
//             };
//             await redis.lpush(QUEUE_KEY, JSON.stringify(job));
//             console.log(`✅ Added job for ${emailJob.email}`);
//         }

//         // Get queue length
//         console.log("\n📊 Queue Statistics:");
//         const queueLength = await redis.llen(QUEUE_KEY);
//         console.log(`Queue Length: ${queueLength} jobs`);

//         // Process jobs
//         console.log("\n⚙️ Processing queue...");
//         for (let i = 0; i < queueLength; i++) {
//             const job = await redis.rpop(QUEUE_KEY);
//             if (job) {
//                 const jobData = JSON.parse(job);
//                 console.log(`🔄 Processed: ${jobData.email} - ${jobData.subject}`);
//             }
//         }

//         // Final queue check
//         const finalLength = await redis.llen(QUEUE_KEY);
//         console.log(`\n✅ Queue processing complete! Remaining jobs: ${finalLength}`);

//         // Cleanup and exit
//         await redis.quit();
//         process.exit(0);

//     } catch (error) {
//         console.error("❌ Error:", error);
//         process.exit(1);
//     }
// };

// testQueue();
