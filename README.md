# Vibe - Realtime Chat Application

Vibe is a modern, full-stack real-time messaging application built with the MERN stack and Socket.IO. It features a beautiful, dynamic UI with a dark mode aesthetic, real-time messaging, image sharing, and a responsive design.

## Features

- **Real-time Messaging:** Lightning-fast message delivery using Socket.IO.
- **Image Sharing:** Seamlessly upload and share images in chats (powered by Cloudinary).
- **Authentication:** Secure JWT-based authentication with Bearer tokens and HTTP-only cookies.
- **Active Status:** See who is online in real-time with green indicator dots.
- **Clear Chat:** WhatsApp-style "Clear Chat" feature with a smooth 5-second undo timer.
- **State Management:** Fast and scalable frontend state management using Zustand.
- **Responsive Design:** Fully responsive UI built with Tailwind CSS, working perfectly on mobile and desktop.
- **Analytics:** Integrated Vercel Analytics to track page views and visitor data.

## Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Styling)
- **Zustand** (State Management)
- **Socket.IO Client** (Real-time events)
- **Axios** (API Requests)
- **React Router** (Navigation)
- **Lucide React** (Icons)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database)
- **Socket.IO** (WebSocket Server)
- **JSON Web Tokens (JWT)** (Authentication)
- **Cloudinary** (Cloud image storage)

## Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed on your system. You will also need a free Cloudinary account for image uploads.

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ChatApp
```

### 2. Environment Variables
You need to set up `.env` files for both the frontend and backend.

**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Frontend (`frontend/.env`):**
```env
VITE_BACKEND_URL=http://localhost:5000
```

### 3. Install Dependencies & Run

**Start the Backend:**
```bash
cd backend
npm install
npm run dev
```

**Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Deployment
- The **Frontend** is optimized for deployment on Vercel (includes `vercel.json` for SPA routing).
- The **Backend** is optimized for deployment on Render or Heroku. Make sure to set your production environment variables (like `CLIENT_URL`) correctly in your hosting provider's dashboard.
