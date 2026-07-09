# North Barber

A modern fullstack barbershop management system built with **React, Node.js, Express and MySQL**.

North Barber is a complete portfolio project that simulates the operation of a real barbershop, featuring online appointment booking, an administrative dashboard, customer notifications, authentication, business hours management and much more.

> **This is a fictional project created exclusively for educational and portfolio purposes.**

---

# Preview

> **Frontend:** https://north-barber.vercel.app

> **Backend API:** https://north-barber.onrender.com

---

# Features

## Public Website

* Modern landing page
* Services section
* Barbers section
* Gallery
* Contact section
* Responsive design
* Online appointment booking

## Appointment System

* Select service
* Select barber
* Available dates
* Available time slots
* Customer information form
* Appointment summary
* Success confirmation

## Administration Panel

* Secure administrator login
* Dashboard overview
* Revenue statistics
* Appointment statistics
* Notifications panel

### Services

* Create services
* Edit services
* Activate / deactivate services
* Delete services

### Barbers

* Create barbers
* Edit barbers
* Upload profile images
* Image cropping
* Activate / deactivate barbers
* Delete barbers

### Appointments

* View appointments
* Filters
* Search
* Pagination
* Change appointment status
* Email notifications
* Appointment history

### Business Hours

* Configure opening hours
* Closed days
* Public availability

### Administrator

* Login
* Change password
* Change email
* Password recovery
* Profile management

---

# Technologies

## Frontend

* React
* Vite
* React Router
* React Icons
* React Easy Crop
* CSS3

## Backend

* Node.js
* Express
* MySQL
* JWT Authentication
* Zod
* bcrypt
* Multer
* Nodemailer
* Helmet
* CORS
* Express Rate Limit

---

# Project Structure

```text
north-barber
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── services
│   │   ├── styles
│   │   └── utils
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── database
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   ├── schemas
│   │   ├── services
│   │   ├── utils
│   │   └── server.js
│   │
│   └── package.json
│
├── README.md
└── README.es.md
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/north-barber.git
```

Go to the project folder

```bash
cd north-barber
```

---

# Frontend

Install dependencies

```bash
cd frontend
npm install
```

Create a `.env` file

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Run the development server

```bash
npm run dev
```

Create a production build

```bash
npm run build
```

Preview the production build

```bash
npm run preview
```

---

# Backend

Install dependencies

```bash
cd backend
npm install
```

Create a `.env` file

```env
PORT=3000

FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=north_barber_db

JWT_SECRET=replace_with_secure_secret
JWT_EXPIRES_IN=1d

JWT_RESET_SECRET=replace_with_secure_reset_secret
JWT_RESET_EXPIRES_IN=15m

MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587

MAIL_USER=your_brevo_login
MAIL_PASSWORD=your_brevo_smtp_key

MAIL_FROM="North Barber <your@email.com>"

MAIL_ENABLED=true
```

Run the backend

```bash
npm run dev
```

Production

```bash
npm start
```

---

# Database

The SQL scripts are located in

```text
backend/src/database
```

Execute them in the following order:

```text
schema.sql

seed.sql
```

---

# Production

Recommended deployment

| Service  | Platform   |
| -------- | ---------- |
| Frontend | Vercel     |
| Backend  | Render     |
| Database | MySQL      |
| Email    | Brevo SMTP |

---

# Security

* JWT Authentication
* Password hashing using bcrypt
* Password recovery
* Rate limiting
* Helmet security headers
* CORS configuration
* Input validation with Zod

---

# Responsive Design

The application has been optimized for:

* Desktop
* Laptop
* Tablet
* Mobile devices

---

# Future Improvements

Possible future additions:

* Customer accounts
* Loyalty program
* Online payments
* Multiple branches
* Employee roles
* Analytics dashboard
* Appointment reminders
* Multi-language support

---

# Author

**Julian Haza**

GitHub

https://github.com/hazajulian

---

# License

MIT License.

This project was created exclusively as a portfolio and educational project.
