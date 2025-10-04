# 🧪 API Testing Guide for TaskFlow Backend

This guide provides comprehensive testing for all API endpoints of the TaskFlow backend application.

## 📋 Prerequisites

1. **Backend Server Running**: Ensure the backend server is running on `http://localhost:5000`
2. **Database Connection**: MongoDB should be connected and accessible
3. **Dependencies Installed**: All npm packages should be installed

## 🚀 Quick Start

### Step 1: Start the Backend Server

```bash
cd d:\Assignment\scalable-web-app\backend
npm start
```

### Step 2: Seed the Database (Optional)

```bash
node scripts/seedData.js
```

### Step 3: Run API Tests

```bash
node scripts/testAPI.js
```

## 📊 Available Scripts

| Script        | Command            | Description                         |
| ------------- | ------------------ | ----------------------------------- |
| Start Server  | `npm start`        | Starts the backend server           |
| Seed Database | `npm run seed`     | Populates database with sample data |
| Test APIs     | `npm run test:api` | Runs comprehensive API tests        |
| All Tests     | `npm test`         | Runs all available tests            |

## 🔍 API Endpoints Testing

### Authentication Endpoints

#### 1. Health Check

- **Endpoint**: `GET /api/health`
- **Purpose**: Verify server is running
- **Expected Response**: `200 OK` with server status

#### 2. User Registration

- **Endpoint**: `POST /api/auth/register`
- **Body**:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

- **Expected Response**: `201 Created` with user data and JWT token

#### 3. User Login

- **Endpoint**: `POST /api/auth/login`
- **Body**:

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

- **Expected Response**: `200 OK` with user data and JWT token

#### 4. Get User Profile

- **Endpoint**: `GET /api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**: `200 OK` with user profile data

#### 5. User Logout

- **Endpoint**: `POST /api/auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**: `200 OK` with logout confirmation

### Task Management Endpoints

#### 6. Create Task

- **Endpoint**: `POST /api/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```json
{
  "title": "Test Task",
  "description": "This is a test task",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2025-10-12T00:00:00.000Z",
  "tags": ["test", "api"]
}
```

- **Expected Response**: `201 Created` with task data

#### 7. Get All Tasks

- **Endpoint**: `GET /api/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters** (optional):
  - `page`: Page number for pagination
  - `limit`: Number of tasks per page
  - `status`: Filter by status (pending, in-progress, completed)
  - `priority`: Filter by priority (low, medium, high)
  - `search`: Search in title and description
  - `sortBy`: Sort field (title, dueDate, priority, createdAt)
  - `sortOrder`: Sort direction (asc, desc)
- **Expected Response**: `200 OK` with tasks array and pagination info

#### 8. Get Single Task

- **Endpoint**: `GET /api/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**: `200 OK` with task data

#### 9. Update Task

- **Endpoint**: `PUT /api/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Any task fields to update
- **Expected Response**: `200 OK` with updated task data

#### 10. Delete Task

- **Endpoint**: `DELETE /api/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**: `200 OK` with deletion confirmation

#### 11. Get Task Statistics

- **Endpoint**: `GET /api/tasks/stats`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**: `200 OK` with task statistics

## 🧪 Automated Testing

The automated test script (`scripts/testAPI.js`) performs the following tests:

1. ✅ **Health Check**: Verifies server is responsive
2. ✅ **User Registration**: Creates a test user account
3. ✅ **User Login**: Authenticates and gets JWT token
4. ✅ **Get Profile**: Retrieves user profile information
5. ✅ **Create Task**: Creates a new test task
6. ✅ **Get All Tasks**: Retrieves task list with pagination
7. ✅ **Get Single Task**: Retrieves specific task details
8. ✅ **Update Task**: Modifies task properties
9. ✅ **Task Filtering**: Tests filtering and search functionality
10. ✅ **Task Statistics**: Retrieves task analytics
11. ✅ **Unauthorized Access**: Tests security by accessing protected routes without token
12. ✅ **Delete Task**: Removes the test task
13. ✅ **User Logout**: Properly logs out the user

## 📈 Sample Data

The seed script creates:

- **4 Users** with different profiles
- **8 Tasks** with various statuses, priorities, and due dates

### Sample User Credentials

```
Email: john@example.com | Password: password123
Email: jane@example.com | Password: password123
Email: mike@example.com | Password: password123
Email: sarah@example.com | Password: password123
```

## 🔧 Manual Testing with cURL

If you prefer manual testing, here are sample cURL commands:

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Tasks (replace TOKEN with actual JWT)

```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

## 🐛 Troubleshooting

### Common Issues

1. **Server Not Running**: Make sure backend server is started
2. **Database Connection**: Verify MongoDB connection string in `.env`
3. **Port Conflicts**: Ensure port 5000 is available
4. **Missing Dependencies**: Run `npm install` in backend directory

### Error Codes

| Code | Description  | Solution                                  |
| ---- | ------------ | ----------------------------------------- |
| 401  | Unauthorized | Check JWT token validity                  |
| 404  | Not Found    | Verify endpoint URL and method            |
| 500  | Server Error | Check server logs and database connection |

## 📝 Test Results Format

The automated tests provide colored output:

- ✅ **Green**: Test passed
- ❌ **Red**: Test failed
- ⚠️ **Yellow**: Warning or skipped test
- ℹ️ **Blue**: Information message

## 🎯 Coverage

This testing suite covers:

- ✅ All authentication flows
- ✅ Complete CRUD operations for tasks
- ✅ Input validation and error handling
- ✅ JWT token authentication and authorization
- ✅ Database operations and data integrity
- ✅ API response formats and status codes
- ✅ Security testing (unauthorized access)

## 🚀 Next Steps

After running tests successfully:

1. Frontend integration testing
2. End-to-end testing with UI
3. Performance testing with load tests
4. Security penetration testing

---

**Note**: This testing suite demonstrates a fully functional REST API with proper authentication, authorization, and CRUD operations for a production-ready task management system.
