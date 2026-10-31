# To-Do List Application (MERN)

React + Node/Express + MongoDB with JWT authentication.

## Features
- Register / login with JWT (passwords hashed with bcrypt)
- Full CRUD on tasks via REST APIs (each user sees only their own tasks)
- Status workflow: Pending / In-Progress / Completed
- Server-side validation and structured error handling
- Pagination, filtering by status, title search, and sorting
- Routes / controllers / models separation, React Hooks and reusable components

## API
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/tasks?status=&search=&sortBy=&order=&page=&limit= | List tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task / status |
| DELETE | /api/tasks/:id | Delete task |

Send the token as `Authorization: Bearer <token>` on `/api/tasks`.

## Setup
1. Install Node 18+ and have MongoDB running locally (or use a free MongoDB Atlas URI).
2. `cp server/.env.example server/.env` and edit values.
3. `npm run install-all`
4. Two terminals: `npm run dev:server` and `npm run dev:client`, then open http://localhost:5173

## Deployment (Render / Railway + MongoDB Atlas)
- Build command: `npm run install-all && npm run build`
- Start command: `NODE_ENV=production npm start`
- Env vars: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`

## Tech
React (Vite), Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## v2 Features
Light/Dark mode, 4 colour palettes, glass UI, dashboard stats + progress bar, priority levels (Low/Medium/High), overdue detection, List and Kanban board views with drag-and-drop status change, combined search/status/priority filters, improved error messages, fully responsive.
