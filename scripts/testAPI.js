const axios = require("axios");
require("colors");

// API Configuration
const API_BASE_URL = "http://localhost:5000/api";
let authToken = "";
let testUserId = "";
let testTaskId = "";

// Check if server is running before starting tests
const checkServerHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000,
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Test utilities
const logSuccess = (message) => console.log(`✅ ${message}`.green);
const logError = (message) => console.log(`❌ ${message}`.red);
const logInfo = (message) => console.log(`ℹ️  ${message}`.blue);
const logWarning = (message) => console.log(`⚠️  ${message}`.yellow);

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Test data
const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
};

const testTask = {
  title: "Test Task",
  description: "This is a test task created by the API test script",
  status: "pending",
  priority: "medium",
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  tags: ["test", "api", "automation"],
};

// Test functions
const testHealthCheck = async () => {
  try {
    logInfo("Testing health check endpoint...");
    const response = await api.get("/health");

    if (response.status === 200 && response.data.success) {
      logSuccess("Health check passed");
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
    } else {
      logError("Health check failed - Invalid response");
    }
  } catch (error) {
    logError(`Health check failed: ${error.message}`);
  }
  console.log("");
};

const testUserRegistration = async () => {
  try {
    logInfo("Testing user registration...");
    const response = await api.post("/auth/register", testUser);

    if (response.status === 201 && response.data.success) {
      logSuccess("User registration successful");
      authToken = response.data.token;
      testUserId = response.data.user._id;
      console.log(`   User ID: ${testUserId}`);
      console.log(`   Token: ${authToken.substring(0, 20)}...`);
    } else {
      logError("User registration failed - Invalid response");
    }
  } catch (error) {
    if (
      error.response?.status === 400 &&
      error.response.data.message.includes("already exists")
    ) {
      logWarning("User already exists, attempting login...");
      await testUserLogin();
    } else {
      logError(
        `User registration failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }
  console.log("");
};

const testUserLogin = async () => {
  try {
    logInfo("Testing user login...");
    const response = await api.post("/auth/login", {
      email: testUser.email,
      password: testUser.password,
    });

    if (response.status === 200 && response.data.success) {
      logSuccess("User login successful");
      authToken = response.data.token;
      testUserId = response.data.user._id;
      console.log(`   User ID: ${testUserId}`);
      console.log(`   Token: ${authToken.substring(0, 20)}...`);
    } else {
      logError("User login failed - Invalid response");
    }
  } catch (error) {
    logError(
      `User login failed: ${error.response?.data?.message || error.message}`
    );
  }
  console.log("");
};

const testGetProfile = async () => {
  try {
    logInfo("Testing get user profile...");
    const response = await api.get("/auth/profile");

    if (response.status === 200 && response.data.success) {
      logSuccess("Get profile successful");
      console.log(
        `   User: ${response.data.user.name} (${response.data.user.email})`
      );
    } else {
      logError("Get profile failed - Invalid response");
    }
  } catch (error) {
    logError(
      `Get profile failed: ${error.response?.data?.message || error.message}`
    );
  }
  console.log("");
};

const testCreateTask = async () => {
  try {
    logInfo("Testing task creation...");
    const response = await api.post("/tasks", testTask);

    if (response.status === 201 && response.data.success) {
      logSuccess("Task creation successful");
      testTaskId = response.data.task._id;
      console.log(`   Task ID: ${testTaskId}`);
      console.log(`   Title: ${response.data.task.title}`);
    } else {
      logError("Task creation failed - Invalid response");
    }
  } catch (error) {
    logError(
      `Task creation failed: ${error.response?.data?.message || error.message}`
    );
  }
  console.log("");
};

const testGetTasks = async () => {
  try {
    logInfo("Testing get all tasks...");
    const response = await api.get("/tasks");

    if (response.status === 200 && response.data.success) {
      logSuccess(
        `Get tasks successful - Found ${response.data.tasks.length} tasks`
      );
      console.log(`   Total: ${response.data.total}`);
      console.log(`   Page: ${response.data.page}`);
      console.log(`   Limit: ${response.data.limit}`);
    } else {
      logError("Get tasks failed - Invalid response");
    }
  } catch (error) {
    logError(
      `Get tasks failed: ${error.response?.data?.message || error.message}`
    );
  }
  console.log("");
};

const testGetSingleTask = async () => {
  if (!testTaskId) {
    logWarning("Skipping get single task - No task ID available");
    console.log("");
    return;
  }

  try {
    logInfo("Testing get single task...");
    const response = await api.get(`/tasks/${testTaskId}`);

    if (response.status === 200 && response.data.success) {
      logSuccess("Get single task successful");
      console.log(`   Task: ${response.data.task.title}`);
      console.log(`   Status: ${response.data.task.status}`);
    } else {
      logError("Get single task failed - Invalid response");
    }
  } catch (error) {
    logError(
      `Get single task failed: ${
        error.response?.data?.message || error.message
      }`
    );
  }
  console.log("");
};

const testUpdateTask = async () => {
  if (!testTaskId) {
    logWarning("Skipping update task - No task ID available");
    console.log("");
    return;
  }

  try {
    logInfo("Testing task update...");
    const updateData = {
      title: "Updated Test Task",
      status: "in-progress",
      priority: "high",
    };

    const response = await api.put(`/tasks/${testTaskId}`, updateData);

    if (response.status === 200 && response.data.success) {
      logSuccess("Task update successful");
      console.log(`   Updated title: ${response.data.task.title}`);
      console.log(`   Updated status: ${response.data.task.status}`);
    } else {
      logError("Task update failed - Invalid response");
    }
  } catch (error) {
    logError(
      `Task update failed: ${error.response?.data?.message || error.message}`
    );
  }
  console.log("");
};

const testTaskFiltering = async () => {
  try {
    logInfo("Testing task filtering...");
    const response = await api.get(
      "/tasks?status=pending&priority=high&limit=5"
    );

    if (response.status === 200 && response.data.success) {
      logSuccess(
        `Task filtering successful - Found ${response.data.tasks.length} filtered tasks`
      );
      console.log(`   Filters applied: status=pending, priority=high, limit=5`);
    } else {
      logError("Task filtering failed - Invalid response");
    }
  } catch (error) {
    logError(
      `Task filtering failed: ${error.response?.data?.message || error.message}`
    );
  }
  console.log("");
};

const testTaskSearch = async () => {
  try {
    logInfo("Testing task search...");
    const response = await api.get("/tasks?search=test");

    if (response.status === 200 && response.data.success) {
      logSuccess(
        `Task search successful - Found ${response.data.tasks.length} tasks`
      );
      console.log(`   Search term: "test"`);
    } else {
      logError("Task search failed - Invalid response");
    }
  } catch (error) {
    logError(
      `Task search failed: ${error.response?.data?.message || error.message}`
    );
  }
  console.log("");
};

const testTaskStats = async () => {
  try {
    logInfo("Testing task statistics...");
    const response = await api.get("/tasks/stats");

    if (response.status === 200 && response.data.success) {
      logSuccess("Task statistics successful");
      console.log(`   Stats: ${JSON.stringify(response.data.stats, null, 2)}`);
    } else {
      logError("Task statistics failed - Invalid response");
    }
  } catch (error) {
    logError(
      `Task statistics failed: ${
        error.response?.data?.message || error.message
      }`
    );
  }
  console.log("");
};

const testDeleteTask = async () => {
  if (!testTaskId) {
    logWarning("Skipping delete task - No task ID available");
    console.log("");
    return;
  }

  try {
    logInfo("Testing task deletion...");
    const response = await api.delete(`/tasks/${testTaskId}`);

    if (response.status === 200 && response.data.success) {
      logSuccess("Task deletion successful");
      console.log(`   Deleted task: ${testTaskId}`);
    } else {
      logError("Task deletion failed - Invalid response");
    }
  } catch (error) {
    logError(
      `Task deletion failed: ${error.response?.data?.message || error.message}`
    );
  }
  console.log("");
};

const testUserLogout = async () => {
  try {
    logInfo("Testing user logout...");
    const response = await api.post("/auth/logout");

    if (response.status === 200 && response.data.success) {
      logSuccess("User logout successful");
      authToken = "";
    } else {
      logError("User logout failed - Invalid response");
    }
  } catch (error) {
    logError(
      `User logout failed: ${error.response?.data?.message || error.message}`
    );
  }
  console.log("");
};

const testUnauthorizedAccess = async () => {
  try {
    logInfo("Testing unauthorized access...");
    const tempToken = authToken;
    authToken = ""; // Remove token temporarily

    const response = await api.get("/tasks");
    logError("Unauthorized access test failed - Should have been rejected");
  } catch (error) {
    if (error.response?.status === 401) {
      logSuccess("Unauthorized access properly rejected");
    } else {
      logError(`Unexpected error: ${error.message}`);
    }
    authToken = tempToken; // Restore token
  }
  console.log("");
};

// Main test runner
const runAPITests = async () => {
  console.log("🧪 Starting API Endpoint Tests".cyan.bold);
  console.log("=".repeat(50).cyan);
  console.log("");

  // Check if server is running
  logInfo("Checking server health...");
  const isServerRunning = await checkServerHealth();

  if (!isServerRunning) {
    logError("Backend server is not running or not responding!");
    logInfo("Please start the backend server first:");
    console.log("   cd d:\\Assignment\\scalable-web-app\\backend");
    console.log("   npm start");
    process.exit(1);
  }

  logSuccess("Server is running and healthy");
  console.log("");

  // Test order is important - some tests depend on previous ones
  await testHealthCheck();
  await testUserRegistration();
  await testGetProfile();
  await testCreateTask();
  await testGetTasks();
  await testGetSingleTask();
  await testUpdateTask();
  await testTaskFiltering();
  await testTaskSearch();
  await testTaskStats();
  await testUnauthorizedAccess();
  await testDeleteTask();
  await testUserLogout();

  console.log("🎉 API Tests Completed!".cyan.bold);
  console.log("=".repeat(50).cyan);
};

// Error handling for the main process
process.on("unhandledRejection", (err) => {
  logError(`Unhandled Promise Rejection: ${err.message}`);
  process.exit(1);
});

// Run tests if this file is executed directly
if (require.main === module) {
  runAPITests().catch((error) => {
    logError(`Test runner failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runAPITests };
