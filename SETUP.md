# DSA Sheet Application - Setup Guide

## 🚀 Quick Start

This guide will help you set up and run the DSA Sheet web application on your local machine.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager

## 🛠️ Installation Steps

### 1. Clone and Navigate to Project

```bash
# Navigate to your project directory
cd /path/to/your/project

# Install root dependencies
npm install
```

### 2. Database Setup

#### Create PostgreSQL Database

1. Open your PostgreSQL client (pgAdmin, psql, or any GUI tool)
2. Create a new database:
   ```sql
   CREATE DATABASE dsa_sheet_db;
   ```

#### Configure Environment Variables

1. Copy the environment example file:
   ```bash
   cd backend
   cp env.example .env
   ```

2. Edit the `.env` file with your database credentials:
   ```env
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/dsa_sheet_db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=5000
   NODE_ENV=development
   ```

   **Important:** Replace `your_username` and `your_password` with your actual PostgreSQL credentials.

### 3. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root directory
cd ..
```

### 4. Database Migration and Seeding

```bash
# Navigate to backend directory
cd backend

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with initial data
npx prisma db seed
```

### 5. Start the Application

#### Development Mode (Recommended)

From the root directory:

```bash
# Start both backend and frontend concurrently
npm run dev
```

This will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

#### Manual Start (Alternative)

If you prefer to start services separately:

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

## 🎯 First Time Setup

1. **Open your browser** and navigate to http://localhost:3000
2. **Register a new account** or use the demo credentials
3. **Explore the application**:
   - Browse topics and problems
   - Mark problems as completed
   - Track your progress
   - View learning resources

## 📁 Project Structure

```
dsa-sheet-app/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Authentication middleware
│   │   └── index.ts        # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Initial data
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── lib/            # Utility functions
│   └── package.json
└── package.json            # Root package.json
```

## 🔧 Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run install:all` - Install dependencies for all packages

### Backend Directory
- `npm run dev` - Start backend server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Frontend Directory
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🗄️ Database Management

### View Database
```bash
cd backend
npx prisma studio
```

### Reset Database
```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```

### Generate New Migration
```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check your database credentials in `.env`
   - Ensure the database exists

2. **Port Already in Use**
   - Change the port in `.env` file
   - Kill processes using the ports

3. **Dependencies Not Found**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

4. **Prisma Errors**
   - Run `npx prisma generate` after schema changes
   - Ensure database is accessible

### Reset Everything

If you need to start fresh:

```bash
# Remove all dependencies
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json

# Reinstall everything
npm run install:all

# Reset database
cd backend
npx prisma migrate reset
npx prisma db seed
```

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Use a production PostgreSQL database
3. Set a strong JWT secret
4. Configure CORS origins for your frontend domain

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update API base URL in production

## 📚 Features Overview

- ✅ **User Authentication** - Register, login, and secure sessions
- ✅ **Topic Organization** - Browse DSA topics with structured problems
- ✅ **Progress Tracking** - Mark problems as completed with checkboxes
- ✅ **Learning Resources** - YouTube videos, LeetCode, Codeforces, and articles
- ✅ **Difficulty Levels** - Easy, Medium, Hard with color coding
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Search & Filter** - Find problems by topic, difficulty, or search terms

## 🤝 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure database is properly configured
4. Check console logs for error messages

## 📝 License

This project is licensed under the MIT License.
