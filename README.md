# 🎓 Course-It

**Course-It** is a full-stack collaborative learning platform where users can create or join courses, chat in real-time, send friend requests, and even make video calls. Designed for scalability and responsiveness, it includes modern backend optimizations and a clean frontend UI.

---

## ✨ Key Features

### 🔐 Authentication & Security
- ✅ Secure login with JWT + HTTP-only cookies
- 🔁 Persistent sessions via refresh tokens
- 🚫 Rate limiting & bot protection (Arcjet)
- 🛡️ Role-based access: User/Admin

### 📚 Courses
- ➕ Create & join courses
- 🛠️ Admin controls over content & members
- 💬 Real-time group chat (Socket.IO)

### 💬 Chat System
- 🗣️ 1-on-1 private messaging
- 👥 Group chats per course
- 👋 Friend requests & friend list

### 📝 Quiz Module
- ⏱️ Timed quizzes with auto-evaluation
- 🛑 Admin: create, pause, or delete quizzes
- 📊 Score summary after submission

### 📹 Video Calling
- 🧑‍🤝‍🧑 Group calls powered by [Stream](https://getstream.io)
- ⚡ Peer-to-peer & scalable architecture

### ⚙️ Backend Highlights
- ⚡ Redis for caching & rate-limiting
- 🧠 Indexed MongoDB schemas for performance
- 🔒 Secure auth, cookie handling, and validations
- 📦 Compression, pagination, and speed tuning
- 🧑‍💼 Admin access to manage users/courses

### 💻 Frontend Experience
- ⚛️ React + Tailwind CSS
- 🎨 Smooth UI with Framer Motion
- 🔃 Lazy loading (infinite scroll)
- 📱 Fully responsive — Tablet & Desktop

---

## 🛠️ Tech Stack

### 💻 Frontend

- ⚛️ **React** – Component-based JavaScript UI library  
- 🎨 **Tailwind CSS** – Utility-first CSS framework  
- 🐻 **Zustand** – Lightweight state management solution  
- 📡 **Axios** – Promise-based HTTP client  
- 💫 **Framer Motion** – Declarative animations for React

---

### 🧠 Backend

- 🟢 **Node.js** – JavaScript runtime built on Chrome's V8  
- 🚂 **Express.js** – Fast and minimalist web framework  
- 🍃 **MongoDB** – NoSQL document database  
- 📦 **Mongoose** – Elegant MongoDB object modeling  
- 🧠 **Redis** – In-memory key-value store for caching & rate limiting  
- 🔌 **Socket.IO** – Real-time bidirectional communication  
- 🔐 **JWT + Secure Cookies** – Auth with HTTP-only cookie storage

### ⚙️ DevOps / Deployment
- 🐳 Docker (for local setup)
- ⚙️ Jenkins (CI/CD locally)
- 🔃 Nginx (for laod balancing)
- 🚀 Render (Production)
- 🎥 Stream (Video Call API)

---

## 📦 Getting Started (Local Setup)

## 1. Clone the Repository

```bash
git clone https://github.com/Raj-dev08/Course-It.git
cd Course-It
```

## 2. Setup env variables 

### backend/.env
- PORT=5000
- MONGO_URI=your_mongodb_uri
- JWT_SECRET=your_jwt_secret
- REDIS_URL=your_redis_url
- STREAM_API_KEY=your_stream_key
- STREAM_API_SECRET=your_stream_secret

- ARCJET_KEY= your_arcjet_key


### frontend/.env
- VITE_STREAM_KEY=your_stream_key

## 3. Run locally 

```
cd backend
npm install
npm run dev
```

```
cd frontend
npm install
npm run dev
```
## 🚀 Live Demo

🌍 **Check it out here:**  
🔗 [Click to Open Course-It on Render](https://course-it-2s22.onrender.com)

# demo credentials for accessing 
- Email: hi@gmail.com
- Password: 1234
