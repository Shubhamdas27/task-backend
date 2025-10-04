const Task = require("../models/Task");
const { sanitizeInput } = require("../utils/auth");

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      search,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    // Build query
    const query = { user: req.user.id };

    // Filter by status
    if (status && ["pending", "in-progress", "completed"].includes(status)) {
      query.status = status;
    }

    // Filter by priority
    if (priority && ["low", "medium", "high"].includes(priority)) {
      query.priority = priority;
    }

    // Search in title and description
    if (search) {
      const searchRegex = new RegExp(sanitizeInput(search), "i");
      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    // Execute query
    const tasks = await Task.find(query)
      .sort(sort)
      .limit(limitNum)
      .skip(startIndex)
      .lean();

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    // Pagination result
    const pagination = {};

    if (startIndex + limitNum < total) {
      pagination.next = {
        page: pageNum + 1,
        limit: limitNum,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: pageNum - 1,
        limit: limitNum,
      };
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      pagination,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    // Sanitize input
    const taskData = {
      title: sanitizeInput(title),
      user: req.user.id,
    };

    if (description) {
      taskData.description = sanitizeInput(description);
    }

    if (status && ["pending", "in-progress", "completed"].includes(status)) {
      taskData.status = status;
    }

    if (priority && ["low", "medium", "high"].includes(priority)) {
      taskData.priority = priority;
    }

    if (dueDate) {
      taskData.dueDate = new Date(dueDate);
    }

    if (tags && Array.isArray(tags)) {
      taskData.tags = tags
        .map((tag) => sanitizeInput(tag))
        .filter((tag) => tag.length > 0);
    }

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;

    // Find task
    let task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Build update object
    const updateData = {};

    if (title) {
      updateData.title = sanitizeInput(title);
    }

    if (description !== undefined) {
      updateData.description = sanitizeInput(description);
    }

    if (status && ["pending", "in-progress", "completed"].includes(status)) {
      updateData.status = status;
    }

    if (priority && ["low", "medium", "high"].includes(priority)) {
      updateData.priority = priority;
    }

    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }

    if (tags !== undefined && Array.isArray(tags)) {
      updateData.tags = tags
        .map((tag) => sanitizeInput(tag))
        .filter((tag) => tag.length > 0);
    }

    task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      {
        $match: { user: req.user._id },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityStats = await Task.aggregate([
      {
        $match: { user: req.user._id },
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Task.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: stats,
        byPriority: priorityStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
