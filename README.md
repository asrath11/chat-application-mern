# 💬 Real-Time Chat Application

A modern, full-stack real-time chat application built with cutting-edge technologies. Features instant messaging, user authentication, and a scalable monorepo architecture.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=flat&logo=socket.io&badgeColor=010101)

## ✨ Features

### Core Functionality

- 🚀 **Real-time messaging** with Socket.IO for instant communication
- 🔐 **Secure authentication** using JWT tokens with refresh token support
- 👥 **Group chat support** with participant management
- 💬 **One-on-one messaging** for private conversations
- 📝 **Message history** with persistent storage
- 🟢 **Presence indicators** showing online/offline/last seen status
- ⌨️ **Typing indicators** for enhanced user experience
- ✓ **Read receipts** to track message delivery status
- 🔍 **User search** for finding and connecting with others

### Technical Highlights

- 📦 **Monorepo architecture** with Turborepo for efficient builds
- 🎨 **Modern UI** with TailwindCSS 4 and Radix UI components
- 🔄 **Type-safe** with shared TypeScript types across frontend and backend
- 🛡️ **Security-first** with Helmet.js and bcrypt password hashing
- ✅ **Validation** using Zod schemas on both client and server
- 📊 **Efficient data fetching** with React Query (TanStack Query)

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### Frontend

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS 4
- **Routing:** React Router v7
- **State Management:** React Query (TanStack Query)
- **Forms:** React Hook Form + Zod
- **UI Components:** Radix UI
- **Real-time:** Socket.IO Client

</td>
<td valign="top" width="50%">

### Backend

- **Runtime:** Node.js 22+
- **Framework:** Express 5
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Real-time:** Socket.IO
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet.js, bcrypt
- **Validation:** Zod

</td>
</tr>
</table>

### DevOps & Tooling

- **Monorepo:** Turborepo with pnpm workspaces
- **Package Manager:** pnpm 9.0.0
- **Deployment:** Vercel-ready configuration
- **Code Quality:** ESLint, Prettier, TypeScript strict mode

## 📁 Project Structure

```
chat-application/
├── apps/
│   ├── backend/                 # Express API server
│   │   ├── src/
│   │   │   ├── config/         # Configuration files
│   │   │   ├── controllers/    # Route controllers
│   │   │   ├── middlewares/    # Custom middleware
│   │   │   ├── models/         # Mongoose models
│   │   │   ├── routes/         # API routes
│   │   │   ├── socket/         # Socket.IO handlers
│   │   │   ├── utils/          # Helper functions
│   │   │   └── index.ts        # Entry point
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── frontend/               # React application
│       ├── src/
│       │   ├── app/           # App configuration
│       │   ├── components/    # Reusable components
│       │   ├── features/      # Feature modules
│       │   ├── hooks/         # Custom React hooks
│       │   ├── services/      # API services
│       │   └── main.tsx       # Entry point
│       └── package.json
│
├── packages/
│   └── shared-types/          # Shared TypeScript types
│       ├── src/
│       └── package.json
│
├── turbo.json                 # Turborepo configuration
├── pnpm-workspace.yaml        # pnpm workspace config
└── package.json               # Root package.json
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 22.12.0 ([Download](https://nodejs.org/))
- **pnpm** 9.0.0+ (`npm install -g pnpm`)
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/asrath11/chat-application-mern
   cd chat-application-mern
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `apps/backend/` directory:

   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```

   Update with your configuration:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database
   MONGO_URI=mongodb://localhost:27017/chat-app
   # Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/chat-app

   # JWT Secrets (use strong, random strings in production)
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
   JWT_EXPIRES_IN=15d
   JWT_REFRESH_EXPIRES_IN=30d
   ```

4. **Start the development servers**

   ```bash
   # Start both frontend and backend
   pnpm dev

   # Or start individually
   pnpm dev --filter=backend
   pnpm dev --filter=frontend
   ```

5. **Access the application**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000](http://localhost:3000)
   - API Health Check: [http://localhost:3000/api/health](http://localhost:3000/api/health)

## 📜 Available Scripts

### Root Level Commands

```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps and packages
pnpm lint         # Lint all apps
pnpm format       # Format code with Prettier
pnpm type-check   # Type check all TypeScript files
pnpm clean        # Clean all build artifacts
```

### Backend Specific

```bash
cd apps/backend
pnpm dev          # Start with hot reload (nodemon)
pnpm build        # Compile TypeScript to JavaScript
pnpm start        # Run production build
pnpm lint         # Lint backend code
```

### Frontend Specific

```bash
cd apps/frontend
pnpm dev          # Start Vite dev server
pnpm build        # Build for production
pnpm preview      # Preview production build locally
pnpm lint         # Lint frontend code
```

## 🚢 Deployment

### Deploy to Vercel

This project includes Vercel configuration for seamless deployment.

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to Project Settings → Environment Variables
   - Add all variables from your `.env` file

### Other Deployment Options

**Backend:**

- Deploy to Railway, Render, or any Node.js hosting platform
- Ensure MongoDB connection string is configured
- Set all environment variables

**Frontend:**

- Can be deployed separately to Vercel, Netlify, or Cloudflare Pages
- Update API endpoint in frontend configuration

## 🗺️ Roadmap

### Completed ✅

- [x] User registration and login
- [x] JWT authentication with refresh tokens
- [x] Real-time one-on-one messaging
- [x] Group chat functionality
- [x] Message history and persistence
- [x] User presence indicators (online/offline/last seen)
- [x] Typing indicators
- [x] Message read receipts
- [x] Group participant management (add/remove)
- [x] User search and selection

### In Progress 🚧

- [ ] File sharing (images, documents)
- [ ] Message reactions (emoji)
- [x] User profiles (view/edit)
- [ ] Message editing
- [ ] Message deletion
- [x] Global search (users, groups)

### Planned 📋

- [ ] Voice messages
- [ ] Video calls integration
- [ ] Push notifications
- [ ] Message forwarding
- [ ] Dark mode theme
- [ ] Message encryption
- [ ] Admin dashboard

## 🏗️ Architecture

### Authentication Flow

```
User Login → JWT Token Generated → Token Stored in Client
           ↓
Authenticated Requests → JWT Verified → Access Granted
           ↓
Token Expires → Refresh Token → New JWT Issued
```

### Real-time Communication

```
Client A → Socket.IO → Server → Socket.IO → Client B
                         ↓
                    MongoDB (Persist)
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style Guidelines

- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

## 📄 License

This project is licensed under the **ISC License**.

## 🐛 Issues & Support

Encountered a bug or have a feature request?

- **Report Issues:** [Open an issue](../../issues)
- **Discussions:** [Join the discussion](../../discussions)

## 👥 Authors

- Asrath

## 🙏 Acknowledgments

- Socket.IO team for real-time communication
- Vercel for hosting solutions
- MongoDB for database services
- All open-source contributors

---

<div align="center">

**[⬆ Back to Top](#-real-time-chat-application)**

Made with ❤️ by Asrath

</div>
