# 🚀 Quickbill - Modern Point of Sale (POS) System

Quickbill is a comprehensive, secure, and fast Point of Sale (POS) application built for retail and wholesale businesses. It simplifies inventory tracking, manages suppliers and customers, and provides real-time sales insights via an intuitive dashboard.

---

## 📸 Screenshots & Demo

- **Live Frontend:** [https://quickbill-livid.vercel.app](https://quickbill-livid.vercel.app)
- **Live Backend (API):** [https://quickbill-imzl.onrender.com](https://quickbill-imzl.onrender.com)

*(Add your dashboard dashboard screenshots here)*

---

## ✨ Key Features

- **📊 Dynamic Dashboard:** Displays sales summaries, 30-day performance trends using interactive charts, and recent order tables.
- **🛒 Smart Order Management:** Supports separate workflows for **Wholesale** and **Retail** sales with tier-based pricing.
- **📦 Inventory & Product Tracking:** Complete management of products, dynamic categories, brands, and automated dynamic price tiers.
- **🔄 Purchase & Returns System:** Seamless supplier purchase logging and robust transaction logic for purchase returns with automated stock level updates.
- **🤝 Contact Management:** Separate modules for tracking both Suppliers and Customers (including automatic "Walk-in Customer" setup).
- **🔒 Secure Authentication:** Protected routes with JSON Web Tokens (JWT) stored safely in secure **HttpOnly Cookies** for high-level XSS prevention.

---

## 💻 Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **UI Component Library:** Material UI (MUI)
- **Data Table:** TanStack Table
- **Data Visualization:** Recharts (PieCharts & BarCharts)
- **State Management & Routing:** React Router DOM & Axios & zustend

### Backend
- **Runtime:** Node.js with Express.js
- **Database ORM:** Prisma
- **Database:** MongoDB
- **Security:** Bcrypt (Password Hashing) & Cookie-Parser

---

## 🛠️ Local Setup Instructions

Follow these steps to run the project locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 1. Clone the repository
```bash
git clone https://github.com/mohammadimran2003/Quickbill.git

## Backend setup

cd quickbill

cd backend

npm install

DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/quickbill"
JWT_SECRET="your_super_secret_jwt_key"
PORT=3000
NODE_ENV="development"

npx prisma generate
npm start

## Frontend setup

cd frontend

npm install

VITE_API_URL="http://localhost:3000/api"

npm run dev

### Author
Mohammad Imran
