Virallens AI Customer Support

A full-stack AI-powered customer support chat application built with React, Node.js, Express, MongoDB, JWT authentication, and OpenRouter.

Features

User signup and login

JWT-based authentication

Password hashing with bcrypt

Protected chat APIs

AI-powered customer support responses

Persistent user-scoped chat history

Markdown-rendered AI responses

Typing indicator

API rate limiting

Input validation

Dockerized frontend and backend

MongoDB Atlas integration

Environment-based configuration

Tech Stack

Frontend

React

Vite

Axios

React Router

React Markdown

CSS

Backend

Node.js

Express

MongoDB

Mongoose

JWT

bcryptjs

Axios

express-rate-limit

AI

OpenRouter

DevOps

Docker

Docker Compose

Nginx

Project Structure

virallens-ai-support/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── Dockerfile
│   └── .env.example
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml
└── README.md


API Endpoints

Authentication

Signup

POST /auth/signup


Request:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}


Login

POST /auth/login


Request:

{
  "email": "john@example.com",
  "password": "password123"
}


Both authentication endpoints return a JWT token on successful authentication.

Chat

All chat endpoints require:

Authorization: Bearer <JWT_TOKEN>


Send Message

POST /chat/send


Request:

{
  "message": "How can I reset my password?"
}


Chat History

GET /chat/history


Returns the authenticated user's stored conversation history.

Health Check

GET /health


Environment Variables

Create server/.env:

PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
CLIENT_URL=http://localhost:5174


Create client/.env:

VITE_API_URL=http://localhost:3000


Never commit real environment variables or API keys to Git.

Running Locally

Backend

cd server
npm install
npm start


The backend runs on:

http://localhost:3000


Frontend

cd client
npm install
npm run dev


The frontend runs on:

http://localhost:5174


Running with Docker

From the project root:

docker compose build
docker compose up


Then open:

http://localhost:5174


To stop the containers:

docker compose down


Authentication Flow

User signs up with name, email and password.

Password is hashed using bcrypt before storage.

Login validates the password and generates a JWT.

The frontend stores the authentication token and sends it with protected API requests.

JWT middleware validates the token before allowing access to chat endpoints.

The authenticated user's ID is used to scope chat history.

Chat Flow

User
  ↓
React Frontend
  ↓
POST /chat/send
  ↓
JWT Authentication
  ↓
Chat Controller
  ↓
OpenRouter AI
  ↓
AI Response
  ↓
MongoDB
  ↓
React Chat UI


Security Considerations

Passwords are never stored in plain text.

JWT authentication protects private chat endpoints.

Chat history is queried using the authenticated user's ID.

API keys are stored in environment variables.

Authentication and chat endpoints use rate limiting.

User messages are validated before processing.

AI responses are handled through a dedicated service layer.

AI Response Safety

The AI service is instructed not to invent customer-specific information such as:



Company policies

Prices

Refund guarantees

Order information

Tracking information

Contact details



When required information is unavailable, the assistant should clearly state that it does not have that information.

Deployment

Frontend

The React application is built using Vite and served through Nginx in the Docker image.

Backend

The Express API runs as a Node.js Docker container.

Database

MongoDB Atlas is used as the persistent database.

AI

OpenRouter is used to generate customer-support responses.

Live Demo

Add deployed application URL here.

Repository

Add GitHub repository URL here.

Assignment

This project was developed as part of the Virallens technical assignment.