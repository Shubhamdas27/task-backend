const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Task = require("./models/Task");

// Demo users data
const demoUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
    avatar:
      "https://ui-avatars.com/api/?name=John+Doe&background=4f46e5&color=ffffff",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "user",
    avatar:
      "https://ui-avatars.com/api/?name=Jane+Smith&background=059669&color=ffffff",
  },
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    avatar:
      "https://ui-avatars.com/api/?name=Admin+User&background=dc2626&color=ffffff",
  },
  {
    name: "Demo Tester",
    email: "demo@taskflow.com",
    password: "demo123",
    role: "user",
    avatar:
      "https://ui-avatars.com/api/?name=Demo+Tester&background=7c3aed&color=ffffff",
  },
  {
    name: "Test Manager",
    email: "manager@example.com",
    password: "manager123",
    role: "admin",
    avatar:
      "https://ui-avatars.com/api/?name=Test+Manager&background=ea580c&color=ffffff",
  },
];

// Demo tasks for each user
const demoTasks = [
  {
    title: "Complete Project Proposal",
    description:
      "Write and submit the Q4 project proposal including budget analysis and timeline",
    priority: "high",
    status: "in-progress",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  {
    title: "Team Meeting - Sprint Planning",
    description:
      "Organize sprint planning meeting with development team for next iteration",
    priority: "medium",
    status: "pending",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
  {
    title: "Update Documentation",
    description:
      "Update API documentation and user guides for the latest version",
    priority: "medium",
    status: "completed",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    title: "Code Review",
    description: "Review pull requests and provide feedback to team members",
    priority: "high",
    status: "in-progress",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
  },
  {
    title: "Database Optimization",
    description:
      "Optimize database queries and improve application performance",
    priority: "low",
    status: "pending",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
  },
  {
    title: "Client Presentation",
    description:
      "Prepare and deliver project progress presentation to stakeholders",
    priority: "high",
    status: "pending",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
  },
];

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

async function clearExistingData() {
  try {
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log("🧹 Cleared existing data");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
  }
}

async function createDemoUsers() {
  try {
    console.log("👥 Creating demo users...");

    const createdUsers = [];

    for (const userData of demoUsers) {
      // Don't hash password here - let the User model pre-save hook handle it
      const user = new User({
        ...userData,
        isVerified: true,
        lastLogin: new Date(),
      });

      const savedUser = await user.save();
      createdUsers.push(savedUser);

      console.log(`✅ Created user: ${userData.name} (${userData.email})`);
    }

    return createdUsers;
  } catch (error) {
    console.error("❌ Error creating demo users:", error);
    return [];
  }
}

async function createDemoTasks(users) {
  try {
    console.log("📋 Creating demo tasks...");

    let taskCount = 0;

    for (const user of users) {
      // Create 2-3 tasks per user
      const userTasks = demoTasks.slice(taskCount, taskCount + 3);

      for (const taskData of userTasks) {
        const task = new Task({
          ...taskData,
          user: user._id,
          tags: ["demo", "sample", taskData.priority],
        });

        await task.save();
        console.log(`✅ Created task for ${user.name}: ${taskData.title}`);
      }

      taskCount += 2;
      if (taskCount >= demoTasks.length) taskCount = 0;
    }
  } catch (error) {
    console.error("❌ Error creating demo tasks:", error);
  }
}

async function generateSummary() {
  try {
    const userCount = await User.countDocuments();
    const taskCount = await Task.countDocuments();

    console.log("\n" + "=".repeat(50));
    console.log("🎉 DEMO DATABASE SEEDED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log(`👥 Users created: ${userCount}`);
    console.log(`📋 Tasks created: ${taskCount}`);
    console.log("\n📧 DEMO LOGIN CREDENTIALS:");
    console.log("=".repeat(30));

    demoUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Role: ${user.role}`);
      console.log("");
    });

    console.log("🚀 Frontend URLs to test:");
    console.log("- Production: https://task-nine-rouge.vercel.app/login");
    console.log("- Local: http://localhost:5173/login");
    console.log("\n💡 Use any of the above credentials to test login!");
    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Error generating summary:", error);
  }
}

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await clearExistingData();

    // Create demo users
    const users = await createDemoUsers();

    if (users.length > 0) {
      // Create demo tasks
      await createDemoTasks(users);

      // Generate summary
      await generateSummary();
    }
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("🔒 Database connection closed");
    process.exit(0);
  }
}

// Run the seed script
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, demoUsers };
