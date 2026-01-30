# 📧 Job Queue System

A production-ready email queue system built with **TypeScript**, **Redis**, and **Nodemailer**. This system demonstrates how to build scalable job queues for processing emails asynchronously.

## 🌟 Features

- ✅ **Asynchronous Email Processing** - Non-blocking queue operations
- ✅ **Redis-backed Queue** - Fast, reliable job storage
- ✅ **Worker Pattern** - Separate process for handling jobs
- ✅ **Error Handling** - Failed emails are automatically re-queued
- ✅ **Environment Configuration** - Easy setup with `.env` file
- ✅ **TypeScript Support** - Full type safety

---

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **Redis** (running locally or remotely)
- **Gmail Account** (with 2-Step Verification enabled)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Zurard/jobqueue.git
cd jobqueue
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Gmail credentials:

```properties
REDIS_HOST=localhost
REDIS_PORT=6379
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SENDER_EMAIL=your-email@gmail.com
```

**⚠️ Important:** Use a **Gmail App Password**, not your regular password:
1. Go to: https://myaccount.google.com/apppasswords
2. Select Mail & Windows Computer
3. Copy the generated 16-character password
4. Paste it as `EMAIL_PASS` in `.env`

### 4. Start Redis Server

```bash
redis-server --daemonize yes
```

Or check if it's running:

```bash
redis-cli ping
# Should return: PONG
```

### 5. Run the Application

**Terminal 1** - Start the Email Worker (background process):

```bash
npm run worker
```

You should see:

```
Processing the email queue
```

**Terminal 2** - Run the Server:

```bash
npm run dev
```

You should see:

```
email:  shreetejmeshram07@gmail.com
password: password123
Starting email processing...
Processing the email queue
✅ Email added to queue! Worker will process it.
🚀 Server running...
Email sent to shreetejmeshram07@gmail.com
```

---

## 📁 Project Structure

```
queue/
├── src/
│   ├── server.ts              # Main application entry point
│   ├── config/
│   │   ├── queue.ts           # Queue class & Redis configuration
│   │   └── emailWorker.ts     # Email processing worker
│   └── services/
│       └── emailService.ts    # Email service configuration
├── .env                       # Environment variables (git ignored)
├── .env.example               # Example environment template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Documentation

```

---

## 💻 How It Works

### Architecture

```
┌─────────────────────────┐
│   Application Server    │
│  (server.ts)           │
│ - Receives requests    │
│ - Adds emails to queue │
└────────────┬────────────┘
             │ (lpush)
             ↓
┌─────────────────────────┐
│   Redis Queue           │
│  ("emailQueue")        │
│  [Email1, Email2, ...] │
└────────────┬────────────┘
             │ (brpop)
             ↓
┌─────────────────────────┐
│   Email Worker          │
│  (emailWorker.ts)       │
│ - Runs continuously    │
│ - Processes emails     │
│ - Sends via Gmail      │
└─────────────────────────┘
```

### Data Flow

1. **User submits form** → Server receives request
2. **Add to Queue** → `addEmailToQueue()` stores email in Redis
3. **Server returns immediately** → Non-blocking operation
4. **Worker picks up job** → `brpop()` gets oldest email from queue
5. **Send email** → Nodemailer sends via Gmail SMTP
6. **Log result** → Success or error logged

---

## 🛠️ Available Commands

```bash
# Install dependencies
npm install

# Run server (development mode)
npm run dev

# Start email worker
npm run worker

# Build to JavaScript
npm build

# Run compiled code (production)
npm start

# Test the queue
npm run test-queue
```

---

## 📚 API Usage

### Adding Email to Queue

```typescript
import { Queue } from "./config/queue";
import Redis from "ioredis";

const redis = new Redis();
const emailQueue = new Queue(redis, "email");

// Add email to queue
await emailQueue.addEmailToQueue(
  "user@example.com",
  "Welcome to our service!"
);
```

### Check Queue Length

```typescript
const length = await emailQueue.getQueueLength();
console.log(`Pending emails: ${length}`);
```

### Get All Emails in Queue

```typescript
const allEmails = await emailQueue.getAll();
console.log(allEmails);
```

---

## 🔧 Configuration

### Queue Configuration

Edit `src/config/queue.ts`:

```typescript
class Queue {
    constructor(redis: Redis, queueName: string) {
        this.redis = redis;
        this.queueName = "emailQueue";  // Change queue name here
    }
}
```

### Email Configuration

Edit `src/config/emailWorker.ts`:

```typescript
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

---

## 🚨 Troubleshooting

### Issue: "Missing credentials for PLAIN"

**Solution:** 
- Make sure `.env` file exists with valid credentials
- Remove quotes from `EMAIL_PASS` value
- Use Gmail App Password, not regular password

### Issue: Redis Connection Refused

**Solution:**
```bash
# Start Redis server
redis-server --daemonize yes

# Verify connection
redis-cli ping
# Should return: PONG
```

### Issue: Email Not Received

**Solution:**
1. Check Gmail spam/junk folder
2. Verify 2-Step Verification is enabled on your Gmail account
3. Check `.env` has correct App Password
4. Look at error logs in worker terminal

### Issue: Worker Not Processing Emails

**Solution:**
1. Make sure worker is running: `npm run worker`
2. Check Redis is running: `redis-cli ping`
3. Verify queue name matches in `queue.ts` and `emailWorker.ts`

---

## 📖 Redis Commands Reference

The system uses these Redis commands:

```bash
# Add to queue (left push)
LPUSH emailQueue "{"email":"user@example.com"}"

# Remove from queue (right pop)
RPOP emailQueue

# Get queue length
LLEN emailQueue

# View all items in queue
LRANGE emailQueue 0 -1

# Delete queue
DEL emailQueue
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use `.gitignore`** - Already included in project
3. **Use App Passwords** - Never use your main Gmail password
4. **Rotate credentials** - Change passwords periodically
5. **Use environment variables** - Never hardcode secrets

---

## 📝 Example Workflow

```bash
# Terminal 1: Start worker
npm run worker

# Terminal 2: Run server (adds email to queue)
npm run dev

# Worker automatically processes the email
# Output: Email sent to shreetejmeshram07@gmail.com
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👤 Author

**Shree** - [GitHub](https://github.com/Zurard)

---

## 🙏 Acknowledgments

- [Bull](https://github.com/OptimalBits/bull) - Job queue inspiration
- [Nodemailer](https://nodemailer.com/) - Email sending library
- [ioredis](https://github.com/luin/ioredis) - Redis client
- [TypeScript](https://www.typescriptlang.org/) - Language

---

## 📞 Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/Zurard/jobqueue/issues)
- Check existing documentation
- Review error logs in terminal

---

**Happy queuing! 🚀**
