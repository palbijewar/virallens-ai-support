/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ChatPage.css";
import ReactMarkdown from "react-markdown";

function ChatPage() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get("/chat/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Failed to load history:", error);

      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchHistory();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    setMessage("");
    setLoading(true);

    // Show user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    try {
      const response = await api.post(
        "/chat/send",
        {
          message: userMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.response,
        },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div>
          <h2>AI Customer Support</h2>
          <span>Hi, {user.name}</span>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="chat-container">
        {loadingHistory ? (
          <p>Loading conversation...</p>
        ) : messages.length === 0 ? (
          <div className="empty-chat">
            <h3>How can I help you?</h3>
            <p>Ask me anything about your order, account, or support issue.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.role === "user" ? "user-message" : "ai-message"
              }`}
            >
              <strong>{msg.role === "user" ? "You" : "AI Assistant"}</strong>

              <div className="message-content">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="message ai-message">
            <strong>AI Assistant</strong>

            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </main>

      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />

        <button type="submit" disabled={loading || !message.trim()}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default ChatPage;
