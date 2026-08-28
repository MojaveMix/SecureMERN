# 🛡️ SecureMERN

> A robust, secure Full-Stack project generator for React and Node.js.

[![Version](https://img.shields.io/badge/version-V0.5-blue.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js->=18.0.0-success.svg)]()

**SecureMERN** is a CLI tool designed to instantly scaffold a professional, Full-Stack application architecture. It sets up a Vite React frontend and an Express Node.js backend, fully pre-configured to work together out of the box.

---

## ✨ Features

- **⚡ Instant Setup:** Scaffolds a complete Full-Stack app in seconds.
- **⚛️ Modern Frontend:** Powered by React and Vite for blazing-fast development.
- **🚀 Scalable Backend:** Clean Express API architecture with decoupled routes and controllers.
- **🔄 Concurrency:** Start both frontend and backend seamlessly with a single command.
- **🔒 Security First:** Includes built-in security defaults like Helmet, CORS, Rate Limiting, Input Validation (Zod), and safe centralized error handling.

## 📦 Quick Start

The fastest way to generate a new project is using `npx`:

```bash
# Generate the project
npx secure-mern create my-awesome-app

# Navigate to the directory
cd my-awesome-app

# Install all dependencies (Frontend & Backend)
npm install

# Start the development servers
npm run dev
```

Your application will start automatically:
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

## 🏗️ Architecture

SecureMERN scaffolds a decoupled client-server architecture:

```text
React + Vite (Client)
        │
    HTTP / JSON
        ↓
Express API (Server)
        ↓
     Node.js
```

### Generated Project Structure

```text
my-app/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Application views
│   │   ├── services/       # API communication (Axios)
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Frontend entry point
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # App & Security configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Custom & Security middlewares
│   │   ├── routes/         # API routes definitions
│   │   ├── validators/     # Input validation schemas
│   │   ├── app.js          # Express app configuration
│   │   └── server.js       # Server entry point
│   └── package.json
│
├── .env.example            # Environment variables template
└── package.json            # Root configuration & scripts
```

## 🔌 API Endpoints

The generated server comes with a default health-check endpoint:

- `GET /api/health`
  - Validates that the Express API is running and accessible.

## 🗺️ Roadmap

We are actively developing SecureMERN. Here is our roadmap:

- [x] **V0.1** — CLI Foundation
- [x] **V0.2** — Project Templates
- [x] **V0.3** — React + Express Integration
- [x] **V0.4** — MySQL + Sequelize Integration
- [x] **V0.5** — Security Foundation (Helmet, Rate Limiting, CORS)
- [ ] **V0.6** — Authentication & JWT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.
