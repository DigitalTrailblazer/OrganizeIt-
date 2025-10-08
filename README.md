# 🗂️ OrganizeIt — because not all tasks are created equal

OrganizeIt is a modern, responsive **Task Manager Application** that helps users **organize, prioritize, and manage** their daily tasks efficiently.
It combines clean UI design, smooth interactions, and robust backend APIs to deliver a distraction-free productivity experience.

---
## 📊 Dashboard Preview

A glimpse of the clean and minimal dashboard interface — designed for clarity and productivity.

![Dashboard Screenshot](./src/assets/dashboard.png)

---

##  Features

###  Core Functionality

*  **Add, Edit, and Delete Tasks** — manage your workflow seamlessly.
*  **Priority Tagging** — categorize tasks as *Low, Medium, or High*.
*  **Due Date Tracking** — stay aware of upcoming deadlines.
*  **Mark as Complete / Pending** — switch task status with ease.
*  **User Authentication (JWT)** — secure login & personalized task list.
*  **Sort & Filter Options** — sort tasks by newest, oldest, or priority.
*  **Fully Responsive UI** — optimized for both mobile and desktop devices.

---

##  UI/UX Highlights

* Built with **React + Tailwind CSS** for a smooth and minimal interface.
* Enhanced accessibility and responsive layouts.
* Interactive buttons, hover states, and focus rings for better user feedback.
* Uses a **modern color palette** designed for focus and productivity.

---

##  Tech Stack

###  Frontend

* **React (Vite)**
* **Tailwind CSS**
* **Lucide React Icons**
* **JWT Auth (via localStorage)**

###  Backend

* **Node.js**
* **Express.js**
* **MongoDB with Mongoose**
* **dotenv** for environment variables
* **CORS**, **bcryptjs**, **jsonwebtoken**

---

##  Entity Relationship Diagram (ERD)

```
┌──────────────────────────┐          ┌─────────────────────────┐
│         USER             │          │         TASK            │
├──────────────────────────┤          ├─────────────────────────┤
│ _id : ObjectId (PK)      │◀─────────│ owner : ObjectId (FK)   │
│ name : String            │   1 ───► │ title : String (req)    │
│ email : String (unique)  │          │ description : String    │
│ password : String (hash) │          │ priority : Enum         │
│ createdAt : Date         │          │ dueDate : Date          │
└──────────────────────────┘          │ completed : Boolean     │
                                      │ createdAt : Date        │
                                      └─────────────────────────┘
```

> Foreign key `owner` in the **TASK** model references the **USER** model’s primary key.

---

##  Project Structure

```
OrganizeIt/
│
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

##  Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/OrganizeIt.git
cd OrganizeIt
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=1111
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

Run the React app:

```bash
npm run dev
```

Now open [http://localhost:5173](http://localhost:5173)
Backend runs on [http://localhost:1111](http://localhost:1111)

---

##  API Endpoints (Summary)

### **Auth Routes**

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | `/api/users/register` | Register a new user |
| POST   | `/api/users/login`    | Login existing user |

### **Task Routes**

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| GET    | `/api/tasks`     | Fetch all user tasks |
| POST   | `/api/tasks`     | Create a new task    |
| PUT    | `/api/tasks/:id` | Update a task        |
| DELETE | `/api/tasks/:id` | Delete a task        |

---

##  Testing

* Tested with **Postman** for all CRUD APIs.
* Handles invalid input gracefully with appropriate status codes and messages.

---

##  Authentication Flow

* Users register and login to get a **JWT token**.
* Token is stored in `localStorage` for session persistence.
* Every API request includes `Authorization: Bearer <token>` header.
* Middleware verifies token before accessing protected routes.

---

##  Future Enhancements

*  Task reminders & notifications
*  Productivity analytics dashboard
*  Task categories and subtasks

---

##  Contributing

Contributions are always welcome!
Fork the repo, make changes, and open a PR.

---

## 🧑‍💻 Author

**Piyush**
- Full Stack Developer

---

## 🪪 License

This project is licensed under the **MIT License** — feel free to use and modify it.

---
