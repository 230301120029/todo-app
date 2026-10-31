# ✅ TaskFlow – To-Do List Application (MERN)

A full-stack task manager built with **React, Node.js, Express and MongoDB**, with JWT authentication and a modern responsive interface.

## 📸 Screenshots

<img width="1917" height="921" alt="To-Do app screenshot 1" src="https://github.com/user-attachments/assets/6d329504-0348-42a7-bf27-d95d2352502d" />

<img width="1917" height="921" alt="To-Do app screenshot 2" src="https://github.com/user-attachments/assets/002d4bd5-4a43-43b3-8e25-87a510a9b04a" />

## ✨ Features
- User registration and login with **JWT** authentication (passwords hashed with bcrypt)
- Complete **CRUD** for tasks using REST APIs; each user sees only their own tasks
- Status workflow: **Pending → In-Progress → Completed**
- Priority levels: Low, Medium, High
- Due dates with overdue detection
- Dashboard with task counts and overall progress bar
- **List view** and **Kanban board view** with drag-and-drop status change
- Search, filter by status and priority, sorting and pagination
- Server-side validation and structured error handling
- Light / Dark mode and 4 colour palettes
- Fully responsive design
- Clean separation of routes, controllers, models and middleware

## 🛠 Tech Stack
React (Vite, Hooks), Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs

## 🔌 API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login and receive JWT |
| GET | /api/tasks | List tasks (status, priority, search, sortBy, order, page, limit) |
| GET | /api/tasks/stats | Dashboard statistics |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task or status |
| DELETE | /api/tasks/:id | Delete task |

Protected routes need the header `Authorization: Bearer <token>`.

## 🚀 Run Locally
1. Install Node.js 18 or newer and have MongoDB running locally, or use a free MongoDB Atlas connection string.
2. Open a terminal inside the `todo-app` folder. Copy `server/.env.example` to `server/.env` and fill in:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_text
JWT_EXPIRES_IN=7d
```
3. Install and start:
```
npm run install-all
npm run dev:server
npm run dev:client
```
(run the last two in separate terminals)
4. Open http://localhost:5173 and register a new account.

## 🌐 Deployment
Build: `npm run install-all && npm run build`
Start: `NODE_ENV=production npm start`
Set `MONGO_URI`, `JWT_SECRET` and `JWT_EXPIRES_IN` on the hosting platform.

## 👤 Author
**Shrimaya Panigrahi**
