# 🎵 AI-Based Record Store

A full-stack web application for buying and selling vinyl records, CDs and LPs online.
Built with React, Node.js, Express.js and MySQL.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MySQL (WAMP) |
| AI Module | Python Flask + Scikit-learn |

---

## ✨ Features

- 🎵 Browse vinyl records, CDs and LPs
- 🎬 YouTube music preview when clicking a record
- 🛒 Shopping cart with 24-hour auto expiry
- 📦 Order management with order tracking
- 🔐 JWT authentication and encrypted passwords
- 👤 Admin dashboard for managing records and orders
- 🤖 AI recommendation system (coming soon)
- 🔒 Auto logout on browser close

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- Python
- WAMP Server (MySQL)
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/GokhulaRaniE/Full_Stack_Record_Store.git
cd Full_Stack_Record_Store
```

### 2. Setup Database
- Start WAMP Server
- Open phpMyAdmin
- Create a database called `recordstore`
- Import the SQL tables (users, records, cart, orders)

### 3. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=recordstore
JWT_SECRET=recordstore123
Run the backend:
```bash
node server.js
```

### 4. Setup Frontend
```bash
cd frontend
npm install
npm start
```

### 5. Open the App
http://localhost:3000

---

## 👤 Default Admin Account
Email: admin@recordstore.com
Password: cd@2027

---

## 📁 Project Structure
record-store/
├── frontend/          # React app
│   └── src/
│       ├── pages/     # All pages
│       └── App.js     # Main app
├── backend/           # Node.js server
│   ├── routes/        # API routes
│   ├── db.js          # Database connection
│   └── server.js      # Main server
└── README.md

---

## 👩‍💻 Built By

Gokhula Rani E — Frontend, Backend, Database, Admin Panel, AI Integration

---

## 📌 Guided By

Dr. M. Nisha, M.Sc., Ph.D.
Associate Professor, Dept. of CSE
Dr. M.G.R Educational and Research Institute, Chennai
