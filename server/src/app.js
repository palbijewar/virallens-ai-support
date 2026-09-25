const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
const { generateAIResponse } = require("./services/ai.service");


app.get("/test-ai", async (req, res) => {
  try {
    const response = await generateAIResponse(
      "What is the purpose of a customer support assistant?"
    );

    res.json({
      success: true,
      response,
    });
} catch (error) {
  console.error("AI service error:");
  console.error("Status:", error.response?.status);
  console.error("Data:", error.response?.data);
  console.error("Message:", error.message);

  throw new Error("Failed to generate AI response");
}
});
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