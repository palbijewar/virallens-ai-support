const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

dotenv.config();

const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "OPENROUTER_API_KEY",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const app = express();

connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Too many messages. Please slow down and try again later.",
  },
});

app.use("/auth", authLimiter, authRoutes);
app.use("/chat", chatLimiter, chatRoutes);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});