const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import models
const User = require("../models/User");
const Task = require("../models/Task");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB for seeding");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Sample users data
const sampleUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
  },
  {
    name: "Mike Johnson",
    email: "mike@example.com",
    password: "password123",
  },
  {
    name: "Sarah Wilson",
    email: "sarah@example.com",
    password: "password123",
  },
];

// Sample tasks data (will be assigned to users after creation)
const sampleTasks = [
  {
    title: "Complete Project Documentation",
    description:
      "Write comprehensive documentation for the new project including API docs and user guides.",
    status: "pending",
    priority: "high",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    tags: ["documentation", "project", "urgent"],
  },
  {
    title: "Review Code Changes",
    description:
      "Review and approve pending pull requests from the development team.",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    tags: ["code-review", "development"],
  },
  {
    title: "Update Dependencies",
    description:
      "Update all npm packages to their latest stable versions and test for compatibility.",
    status: "pending",
    priority: "low",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    tags: ["maintenance", "dependencies"],
  },
  {
    title: "Design UI Mockups",
    description:
      "Create wireframes and mockups for the new dashboard interface.",
    status: "completed",
    priority: "high",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    tags: ["design", "ui", "mockups"],
  },
  {
    title: "Database Optimization",
    description:
      "Optimize database queries and add proper indexing for better performance.",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    tags: ["database", "optimization", "performance"],
  },
  {
    title: "Setup CI/CD Pipeline",
    description:
      "Configure automated testing and deployment pipeline using GitHub Actions.",
    status: "pending",
    priority: "high",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    tags: ["devops", "ci-cd", "automation"],
  },
  {
    title: "User Testing Session",
    description:
      "Conduct user testing sessions to gather feedback on the new features.",
    status: "pending",
    priority: "medium",
    dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    tags: ["testing", "user-experience", "feedback"],
  },
  {
    title: "Security Audit",
    description:
      "Perform comprehensive security audit of the application and fix vulnerabilities.",
    status: "completed",
    priority: "high",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    tags: ["security", "audit", "vulnerability"],
  },
];

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log("🗑️  Cleared existing data");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    const users = [];

    for (const userData of sampleUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = new User({
        ...userData,
        password: hashedPassword,
      });

      const savedUser = await user.save();
      users.push(savedUser);
    }

    console.log(`✅ Created ${users.length} users`);
    return users;
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    return [];
  }
};

// Seed tasks
const seedTasks = async (users) => {
  try {
    const tasks = [];

    for (let i = 0; i < sampleTasks.length; i++) {
      const taskData = sampleTasks[i];
      const user = users[i % users.length]; // Distribute tasks among users

      const task = new Task({
        ...taskData,
        user: user._id,
      });

      const savedTask = await task.save();
      tasks.push(savedTask);
    }

    console.log(`✅ Created ${tasks.length} tasks`);
    return tasks;
  } catch (error) {
    console.error("❌ Error seeding tasks:", error);
    return [];
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await clearData();

    // Seed users
    const users = await seedUsers();

    // Seed tasks
    const tasks = await seedTasks(users);

    console.log("🎉 Database seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Users created: ${users.length}`);
    console.log(`   - Tasks created: ${tasks.length}`);
    console.log(`\n👤 Sample User Credentials:`);
    sampleUsers.forEach((user, index) => {
      console.log(
        `   ${index + 1}. Email: ${user.email} | Password: ${user.password}`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
