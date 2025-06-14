# 🎓 Course-It

**Course-It** is a full-stack collaborative learning platform where users can create or join courses, chat in real-time, send friend requests, and even make video calls. Designed for scalability and responsiveness, it includes modern backend optimizations and a clean frontend UI.

---

## 🚀 Features

### 👥 User System
- Signup/Login with secure JWT authentication (HTTP-only cookies)
- Persistent login with refresh tokens
- Rate limiting and bot protection
- Role-based access control (User/Admin)

### 📚 Courses
- Create, join, and manage courses
- Course group chats with real-time messaging (Socket.IO)
- List of course admins and members

### 💬 Real-Time Chat
- 1-on-1 private messaging
- Course-based group chats
- Friend requests and friend list

### 📹 Video Calling
- Group video calling using [Stream](https://getstream.io)
- Peer-to-peer and scalable integration

### ⚙️ Backend Systems
- Redis-based caching and rate limiting
- MongoDB with schema indexing and query optimization
- JWT auth + secure cookie handling
- Compression, pagination, and performance tuning
- Admin-level control on users/courses

### 🎨 Frontend
- Built with React and Tailwind CSS
- Smooth UI with Framer Motion animations
- Lazy loading (scroll-based)
- Fully responsive (desktop + mobile)

---

## 🛠️ Tech Stack

**Frontend**
- React
- Tailwind CSS
- Axios, Zustand
- Framer Motion

**Backend**
- Node.js, Express.js
- MongoDB + Mongoose
- Redis
- Socket.IO
- JWT Auth (Secure cookies)

**DevOps / Infra**
- Docker (for local setup)
- Render (deployment)
- GitHub Actions or Jenkins (optional CI/CD)
- Stream API for video calling

---

## 📦 Getting Started (Local Setup)

### 1. Clone the Repository

```bash
git clone https://github.com/Raj-dev08/Course-It.git
cd Course-It
```

### 2. Setup env variables 
# backend/.env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
STREAM_API_KEY=your_stream_key
STREAM_API_SECRET=your_stream_secret

# frontend/.env
VITE_STREAM_KEY=your_stream_key

### 3. Run locally 
cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev

### Demo
render link
https://course-it-2s22.onrender.com

# demo credentials for accessing 
Email: hi@gmail.com
Password: 1234
