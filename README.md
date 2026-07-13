<div align="center">

# 🏨 Next Hotels

### Book smarter. Pay with crypto. Chat in real-time.

A modern fullstack hotel booking platform — where traditional hospitality meets Web3.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Sui](https://img.shields.io/badge/Sui-Blockchain-4DA2FF?logo=sui&logoColor=white)](https://sui.io)

🌐 **[Live Demo → mbsc.yaaqin.xyz](https://mbsc.yaaqin.xyz)**

</div>

---

## 🎯 What is Next Hotels?

Next Hotels isn't just another booking app. It's a full-featured hospitality platform that combines a polished booking experience with **Sui blockchain payments**, **real-time updates**, and a data-rich **admin dashboard** — all wrapped in a fast, mobile-first UI.

Whether you're a guest booking your next stay or an admin monitoring revenue, everything happens in one seamless flow.

---

## ✨ Features

### For Guests
- 🏨 **Smart Hotel Booking** — Browse, search, and book with an intuitive date picker flow
- 💳 **Flexible Payments** — Seamless payment experience built into the booking journey
- 🌐 **Pay with Crypto** — Native Sui wallet integration via `@mysten/dapp-kit`
- 🌍 **Speaks Your Language** — Full internationalization with `i18next`
- 📱 **Beautiful Everywhere** — Mobile-first responsive design with buttery-smooth Framer Motion animations

### For Admins
- 📊 **Rich Dashboard** — Revenue and booking insights visualized with Chart.js & Recharts
- 📋 **Powerful Data Tables** — Sorting, filtering, and pagination powered by TanStack Table

### Under the Hood
- 🔐 **Secure Auth** — JWT-based authentication with `next-auth` and cookie management
- 🔄 **Real-time Core** — Socket.IO client for live updates across the app
- 🧩 **Composable UI** — Built on shadcn/ui and Radix UI primitives

---

## 🗺️ Roadmap

### 💬 Real-time Chat — *Coming Soon* 🚧

Direct messaging is on the way! Here's how it'll work:

- ✅ **Google account holders get access** — already signed in with Gmail? You're in.
- 🏷️ **Claim your username first** — pick a unique handle before you can start chatting.
- 💬 **Username-to-username DMs** — find and chat with other users directly by their handle.
- ⚡ **Powered by WebSockets** — instant delivery on the existing Socket.IO real-time layer.

> Have a feature idea? Open an issue and let's talk!

---

## 🧱 Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16, React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4, shadcn/ui, Radix UI |
| State Management | Zustand |
| Data Fetching | Axios, TanStack React Query v5 |
| Tables | TanStack React Table v8 |
| Auth | NextAuth.js, JWT Decode, cookies-next |
| Blockchain | Mysten SUI, Mysten dApp Kit |
| Realtime | Socket.IO Client |
| Charts | Chart.js, Recharts |
| i18n | i18next, react-i18next |
| Animation | Framer Motion |
| Date | date-fns, react-day-picker |
| Icons | Lucide React, HugeIcons |
| Linting | ESLint 9 |
| Containerization | Docker, Docker Compose |
| CI/CD | Jenkins |

---

## 📁 Project Structure

```
next-hotels/
├── src/               # Application source code
├── components/
│   └── ui/            # Reusable UI components (shadcn/ui)
├── lib/               # Utility functions and helpers
├── public/            # Static assets
├── Dockerfile         # Docker image configuration
├── docker-compose.yml # Docker Compose setup
├── Jenkinsfile        # Jenkins CI/CD pipeline
├── components.json    # shadcn/ui component config
└── next.config.ts     # Next.js configuration
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 20`
- npm `>= 10`

### Installation

```bash
# Clone the repository
git clone https://github.com/yaaqin/next-hotels.git
cd next-hotels

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory and fill in the required variables:

```env
NEXTAUTH_URL=http://localhost:9022
NEXTAUTH_SECRET=your_secret_here

# API Base URL
NEXT_PUBLIC_API_URL=https://your-api-url.com

# Add other required environment variables here
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:9022](http://localhost:9022).

---

## 🐳 Docker

### Build and Run with Docker

```bash
docker build -t next-hotels .
docker run -p 9022:9022 next-hotels
```

### Using Docker Compose

```bash
docker-compose up --build
```

---

## 🏗️ Build for Production

```bash
npm run build
npm start
```

---

## 🔧 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server on port 9022 |
| `npm run build` | Build for production |
| `npm start` | Start production server on port 9022 |
| `npm run lint` | Run ESLint |

---

## 📦 CI/CD

This project includes a `Jenkinsfile` for automated build and deployment pipelines. Make sure your Jenkins instance has Docker and Node.js configured as build agents.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and not open for public distribution.

---

<div align="center">

**Built by [yaaqin](https://github.com/yaaqin)**

⭐ Star this repo if you find it interesting!

</div>