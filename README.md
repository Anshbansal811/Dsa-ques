# DSA Sheet Web Application

A comprehensive Data Structures and Algorithms (DSA) learning platform with progress tracking, built using the MERN stack with TypeScript, PostgreSQL, and Tailwind CSS.

## 🚀 Features

### ✅ Implemented Features

1. **🔐 Secure Login System**

   - User registration and authentication
   - JWT token-based authentication
   - Password hashing with bcrypt
   - Protected routes

2. **📚 Topic-wise Chapters/Topics**

   - Structured DSA sheet format
   - 8 main topics: Arrays, Strings, Linked Lists, Stacks & Queues, Trees, Graphs, Dynamic Programming, Sorting & Searching
   - Organized problem hierarchy

3. **📝 Problems Under Each Chapter**

   - Multiple problems per topic (Problem 1, Problem 2, etc.)
   - Detailed problem descriptions
   - Difficulty levels (Easy, Medium, Hard)

4. **🎥 YouTube Tutorial Links**

   - Direct links to video tutorials for each problem
   - Curated learning resources

5. **💻 LeetCode/Codeforces Links**

   - Direct links to practice problems
   - Multiple platform support

6. **📖 Article Links**

   - Theory reference materials
   - GeeksforGeeks and other educational resources

7. **🏷️ Level Indicators**

   - Easy/Medium/Hard difficulty tagging
   - Color-coded difficulty badges
   - Visual progress indicators

8. **✅ Progress Tracker (Checkbox System)**
   - Checkbox for each problem
   - Progress saved when marked as completed
   - Resume from where you left off on next login
   - Progress statistics and analytics

### 🎨 Additional Features

- **📊 Dashboard with Analytics**

  - Progress overview with charts
  - Completion statistics by difficulty
  - Quick action buttons

- **📱 Responsive Design**

  - Mobile-first approach
  - Modern UI with Tailwind CSS
  - Beautiful animations and transitions

- **🔍 Search and Filter**
  - Filter problems by difficulty
  - Search functionality
  - Topic-based organization

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dsa-sheet-app
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Database Setup

#### Create PostgreSQL Database

```sql
CREATE DATABASE dsa_sheet_db;
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/dsa_sheet_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=development
```

#### Run Database Migrations

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

#### Seed the Database

```bash
npx prisma db seed
```

### 4. Start the Application

#### Development Mode

```bash
# From the root directory
npm run dev
```

This will start both backend (port 5000) and frontend (port 3000) concurrently.

#### Production Mode

```bash
# Build the application
npm run build

# Start production servers
npm start
```

## 📁 Project Structure

```
dsa-sheet-app/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── index.ts        # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Database seeder
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

## 🗄️ Database Schema

### Tables

- **users** - User accounts and authentication
- **topics** - DSA topics/chapters
- **problems** - Individual problems with links
- **user_progress** - User completion tracking

### Relationships

- Topics have many Problems
- Users have many Progress records
- Problems have many Progress records

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Topics

- `GET /api/topics` - Get all topics with problems
- `GET /api/topics/:id` - Get specific topic
- `POST /api/topics` - Create topic (admin)
- `PUT /api/topics/:id` - Update topic (admin)
- `DELETE /api/topics/:id` - Delete topic (admin)

### Problems

- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get specific problem
- `POST /api/problems` - Create problem (admin)
- `PUT /api/problems/:id` - Update problem (admin)
- `DELETE /api/problems/:id` - Delete problem (admin)

### Progress

- `GET /api/progress` - Get user progress
- `GET /api/progress/summary` - Get progress summary
- `POST /api/progress/toggle/:problemId` - Toggle problem completion
- `POST /api/progress/:problemId` - Mark problem as completed
- `DELETE /api/progress` - Reset all progress

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Browse Topics**: Explore DSA topics and their problems
3. **Study Problems**: Click on problems to see details and resources
4. **Track Progress**: Mark problems as completed using checkboxes
5. **Monitor Progress**: View your learning progress on the dashboard

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers

## 🚀 Deployment

### Backend Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to your preferred platform (Heroku, Railway, etc.)

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your preferred platform (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Sample DSA problems and links are for educational purposes
- Icons from Lucide React
- UI components styled with Tailwind CSS
