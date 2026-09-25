const Conversation = require("../models/Conversation");
const { generateAIResponse } = require("../services/ai.service");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.userId;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (message.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 2000 characters",
      });
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(message);

    // Find existing conversation
    let conversation = await Conversation.findOne({ userId });

    // Create conversation if user doesn't have one
    if (!conversation) {
      conversation = new Conversation({
        userId,
        messages: [],
      });
    }

    // Add user message
    conversation.messages.push({
      role: "user",
      content: message.trim(),
    });

    // Add AI response
    conversation.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    await conversation.save();

    res.json({
      success: true,
      response: aiResponse,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("Send message error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process message",
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const conversation = await Conversation.findOne({ userId });

    if (!conversation) {
      return res.json({
        success: true,
        messages: [],
      });
    }

    res.json({
      success: true,
      conversationId: conversation._id,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error("Get chat history error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
};
