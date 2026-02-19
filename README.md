# 💬 Real-Time Group & Private Chat Application

A full-stack real-time chat application built using **Node.js, Express, MySQL, and Socket.IO** with support for public chat, private messaging, and media sharing.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based authentication
- Protected routes
- Token verification before establishing Socket.IO connection

---

### 🌍 Public Chat
- Real-time messaging using Socket.IO
- Messages broadcasted to all connected users
- Auto-scroll to latest message
- Persistent message storage in MySQL
- Loads previous public messages on page load

---

### 👤 Private Messaging
- One-to-one real-time messaging
- Dedicated Socket.IO room per user (`user_<userId>`)
- Messages visible only to sender and receiver
- Fetch previous personal chat history
- Active chat user highlighting

---

### 📎 Media Sharing
- Upload images, videos, and PDFs
- File handling using Multer
- File validation (jpeg, jpg, png, mp4, pdf)
- Media URL stored in database
- Real-time media rendering in chat
- Unified rendering logic for text and media messages

---

### 🗄️ Database Integration
- MySQL database
- Sequelize ORM
- Stores:
  - Users
  - Public messages
  - Private messages
  - Media URLs
- Persistent chat history

---

### 🎨 UI Features
- Responsive message layout
- Sender-based alignment (left/right)
- Timestamp display for each message
- Active chat user highlighting
- Tailwind CSS styling

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize
- Socket.IO
- Multer
- JWT Authentication

### Frontend
- Vanilla JavaScript
- Axios
- Socket.IO Client
- Tailwind CSS

---

## 🔄 Real-Time Flow

1. User logs in → JWT issued  
2. Socket connects with auth token  
3. User joins their private room  
4. Messages:
   - Public → `io.emit("message")`
   - Private → `io.to(user_<id>)`
5. Media uploaded → stored → URL emitted via socket  
6. Frontend dynamically renders messages  

---

## 📦 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/piyushkale/Chat-WebApp
cd Chat-WebApp/backend
npm install

create a .env file:
JWT_SECRET=your_secret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=chat_app

start the server
