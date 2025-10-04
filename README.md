# 🚀 TaskFlow Backend API

A comprehensive Node.js backend application for task management with JWT authentication, built with Express.js and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Environment Setup](#environment-setup)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### 🔐 Authentication System

- **User Registration** with email validation
- **Secure Login** with JWT tokens
- **Password Hashing** using bcrypt
- **Protected Routes** with middleware
- **User Profile Management**
- **Logout Functionality**

### 📝 Task Management (Full CRUD)

- **Create Tasks** with title, description, priority, due date, and tags
- **Read Tasks** with filtering, sorting, and pagination
- **Update Tasks** status, content, and properties
- **Delete Tasks** with authorization checks
- **Search Tasks** by title, description, or tags
- **Filter Tasks** by status and priority
- **Task Statistics** and analytics

### 🛡️ Security Features

- **JWT Authentication** for secure API access
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for frontend integration
- **Input Validation** and sanitization
- **Security Headers** with Helmet
- **Error Handling** with custom middleware

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Environment**: dotenv

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Shubhamdas27/task-backend.git
cd task-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment setup**

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the server**

```bash
# Development mode
npm run dev

# Production mode
npm start
```

5. **Seed database (optional)**

```bash
npm run seed
```

6. **Run tests**

```bash
npm run test:api
```

## 🌐 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile

```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

#### Logout User

```http
POST /api/auth/logout
Authorization: Bearer <jwt_token>
```

### Task Management Endpoints

#### Get All Tasks

```http
GET /api/tasks?page=1&limit=10&status=pending&priority=high&search=project
Authorization: Bearer <jwt_token>
```

#### Create Task

```http
POST /api/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Complete Project",
  "description": "Finish the task management project",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-10-15T00:00:00.000Z",
  "tags": ["project", "development"]
}
```

#### Get Single Task

```http
GET /api/tasks/:id
Authorization: Bearer <jwt_token>
```

#### Update Task

```http
PUT /api/tasks/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Task Title",
  "status": "in-progress"
}
```

#### Delete Task

```http
DELETE /api/tasks/:id
Authorization: Bearer <jwt_token>
```

#### Get Task Statistics

```http
GET /api/tasks/stats
Authorization: Bearer <jwt_token>
```

### Utility Endpoints

#### Health Check

```http
GET /api/health
```

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/taskflow-dev
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🗄️ Database Schema

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model

```javascript
{
  title: String (required),
  description: String,
  status: String (pending, in-progress, completed),
  priority: String (low, medium, high),
  dueDate: Date,
  tags: [String],
  user: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Automated Testing

```bash
# Run comprehensive API tests
npm run test:api

# Seed database with sample data
npm run seed
```

### Demo Credentials

```
Email: john@example.com | Password: password123
Email: jane@example.com | Password: password123
Email: mike@example.com | Password: password123
Email: sarah@example.com | Password: password123
```

### Manual Testing with cURL

**Register User:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Login User:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Get Tasks (replace TOKEN):**

```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

## 📁 Project Structure

```
task-backend/
├── controllers/            # Route controllers
│   ├── authController.js   # Authentication logic
│   └── taskController.js   # Task management logic
├── middleware/             # Custom middleware
│   ├── auth.js            # JWT authentication
│   └── errorHandler.js    # Error handling
├── models/                # Database models
│   ├── User.js            # User schema
│   └── Task.js            # Task schema
├── routes/                # API routes
│   ├── auth.js            # Authentication routes
│   └── tasks.js           # Task routes
├── scripts/               # Utility scripts
│   ├── seedData.js        # Database seeding
│   ├── testAPI.js         # API testing
│   └── runTests.bat       # Test runner
├── utils/                 # Utility functions
│   └── auth.js            # Auth helpers
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env.example           # Environment template
└── README.md              # This file
```

## 🚀 Deployment

### Local Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables for Production

- Set `NODE_ENV=production`
- Use secure `JWT_SECRET`
- Configure production MongoDB URI
- Set appropriate CORS origins

## 📊 Performance Features

- **Pagination** for efficient data loading
- **Filtering** and **Search** on server-side
- **Database Indexing** for optimized queries
- **Rate Limiting** for API protection
- **Connection Pooling** with Mongoose

## 🔒 Security Best Practices

- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Security headers with Helmet
- ✅ Environment-based configuration
- ✅ Error handling without data leakage

## 📈 API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* response data */
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "tasks": [
      /* array of tasks */
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Shubham Das**

- GitHub: [@Shubhamdas27](https://github.com/Shubhamdas27)

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB team for the robust database
- All contributors to the open-source packages used

---

## 📞 Support

If you have any questions or need support, please open an issue on GitHub or contact the maintainer.

**Happy Coding! 🚀**
