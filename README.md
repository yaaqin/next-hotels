# 🏨 Next Hotels

A modern, fullstack hotel booking platform built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. Designed for a seamless booking experience with real-time features, authentication, and Web3 integration.

🌐 **Live Demo:** [https://mbsc.yaaqin.xyz](https://mbsc.yaaqin.xyz)

---

## ✨ Features

- 🔐 **Authentication** — JWT-based auth with `next-auth` and cookie management
- 🏨 **Hotel Booking** — Browse, search, and book hotels with date picker support
- 💳 **Payment Integration** — Seamless payment flow within the booking system
- 🌐 **Web3 / SUI Blockchain** — Wallet integration via `@mysten/dapp-kit` and `@mysten/sui`
- 📊 **Admin Dashboard** — Data visualization with Chart.js and Recharts
- 🌍 **Internationalization** — Multi-language support via `i18next` and `react-i18next`
- 🔄 **Real-time** — Socket.IO client for live updates
- 📱 **Responsive UI** — Mobile-first design with Tailwind CSS v4
- 🎨 **Smooth Animations** — Powered by Framer Motion
- 🧩 **Component Library** — Built on shadcn/ui and Radix UI primitives

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

> Built with ❤️ by [yaaqin](https://github.com/yaaqin)