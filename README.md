#  ProjectHub - Collaborative Project Management Tool

A full-stack collaborative project management tool similar to **Trello** and **Asana**, built with the **MERN Stack** (MongoDB, Express, React, Node.js).

![ProjectHub Banner](https://img.shields.io/badge/Status-Production_Ready-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

---

##  Overview

**ProjectHub** is a modern web application that enables teams to collaborate effectively by creating group projects, assigning tasks, and communicating within tasks in real-time. It features a beautiful Kanban-style board interface and supports real-time updates using WebSockets.

---

## ✨ Features

###  Authentication & Security
- User Registration & Login with JWT
- Protected Routes & API Endpoints
- Secure Password Hashing (bcrypt)
- Role-based Access Control (Owner vs Member)

### 📁 Project Management
- Create, Edit, and Delete Projects
- Custom Project Colors
- Add/Remove Team Members
- Owner-only Controls for Sensitive Actions
- Shared Project Access for Collaborators

### ✅ Task Management (Kanban Board)
- Create Tasks with Title, Description, Priority & Due Date
- Assign Tasks to Team Members
- Drag Tasks Across Columns:
  - 📋 **To Do**
  - 🔄 **In Progress**
  - 👀 **Review**
  - ✅ **Done**
- Priority Levels: Low, Medium, High, Urgent
- Edit & Delete Tasks

### 💬 Communication
- Comment on Tasks
- Timestamped Comments
- Real-time Comment Updates

###  Real-Time Collaboration (Bonus)
- WebSocket Integration (Socket.io)
- Live Task Updates Across Browsers
- Real-time Member Changes
- Instant Notifications

###  Responsive Design
- Desktop View (Horizontal Scroll Board)
- Tablet View (Optimized Layout)
- Mobile View (Vertical Stack Columns)
- Mobile-First Approach

---

## 🛠️ Tech Stack

### **Frontend**
- ️ **React 18** - UI Library
- ⚡ **Vite** - Build Tool
- 🧭 **React Router** - Navigation
- 🔌 **Axios** - HTTP Client
- 🔌 **Socket.io-client** - Real-time Communication
- 🎨 **CSS3** - Custom Styling
- 📦 **Context API** - State Management

### **Backend**
- 🟢 **Node.js** - Runtime Environment
- 🚂 **Express.js** - Web Framework
- 🍃 **MongoDB** - NoSQL Database
- 🐘 **Mongoose** - ODM
-  **JWT** - Authentication
- 🔒 **bcryptjs** - Password Hashing
- 🔌 **Socket.io** - WebSocket Server
- 🌐 **CORS** - Cross-Origin Resource Sharing

### **Deployment**
- 🌍 **Vercel** - Frontend Hosting
- ️ **Render** - Backend Hosting
- ️ **MongoDB Atlas** - Cloud Database

---

## 🚀 Live Demo

- **Frontend:** https://project-management-tool.vercel.app
- **Backend API:** https://project-management-backend.onrender.com
- **API Health Check:** https://project-management-backend.onrender.com/api/health

---

## 📦 Installation (Local Development)

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas Account
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/project-management-tool.git
cd project-management-tool
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend/` folder:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/projectmanagement?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
```

Start Backend Server:
```bash
npm run dev
```

### Step 3: Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
```

Create `.env` file in `frontend/` folder:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start Frontend Server:
```bash
npm run dev
```

### Step 4: Open Browser
Navigate to: **http://localhost:3000**

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/users` | Get all users |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get user's projects |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/members` | Add member |
| DELETE | `/api/projects/:id/members/:userId` | Remove member |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/project/:projectId` | Get project tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/task/:taskId` | Get task comments |
| POST | `/api/comments` | Create comment |
| PUT | `/api/comments/:id` | Update comment |
| DELETE | `/api/comments/:id` | Delete comment |

---

## 🏗️ Project Structure

```
project-management-tool/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── comments.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   ├── layout/
    │   │   ├── projects/
    │   │   └── tasks/
    │   ├── context/
    │   │   ── AuthContext.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── projectService.js
    │   │   ├── taskService.js
    │   │   └── commentService.js
    │   ├── utils/
    │   │   └── socket.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

---

##  Testing

### Manual Testing Checklist
- [ ] Register new account
- [ ] Login with credentials
- [ ] Create a project
- [ ] Add team members
- [ ] Create tasks
- [ ] Assign tasks to members
- [ ] Move tasks between columns
- [ ] Add comments to tasks
- [ ] Edit/Delete tasks
- [ ] Edit/Delete projects (Owner only)
- [ ] Test real-time updates (2 browsers)
- [ ] Test responsive design (mobile/tablet)

---

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Backend (Render)
1. Connect repository to Render
2. Set environment variables
3. Deploy as Web Service
4. Update CORS origin

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Areesha**  
- GitHub: [@Areesha221](https://github.com/Areesha221)
- Email: chaudharyareesha400@gmail.com

---

##  Acknowledgments

- Inspired by Trello and Asana
- Built during internship program
- Special thanks to mentors and instructors

---

## 📞 Support

For support, email chaudharyareesha400@gmail.com or open an issue on GitHub.

---

**Made with ❤️ by Areesha**
```

---