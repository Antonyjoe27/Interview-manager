import PreparationTask from '../models/PreparationTask.js';

/**
 * @route   GET /api/tasks
 * @desc    Get all preparation tasks with optional filtering and sorting
 */
export const getTasks = async (req, res, next) => {
  try {
    const { subjectId, completed, status, priority, difficulty, search, sortBy } = req.query;

    const filter = {};

    if (subjectId) {
      filter.subjectId = subjectId;
    }

    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { topic: searchRegex },
        { description: searchRegex }
      ];
    }

    let sort = { dueDate: 1, createdAt: -1 };
    if (sortBy === 'createdAtDesc') {
      sort = { createdAt: -1 };
    } else if (sortBy === 'titleAsc') {
      sort = { title: 1 };
    } else if (sortBy === 'priority') {
      sort = { priority: 1 };
    }

    const tasks = await PreparationTask.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single preparation task by ID
 */
export const getTaskById = async (req, res, next) => {
  try {
    const task = await PreparationTask.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Preparation task not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/tasks
 * @desc    Create a new preparation task
 */
export const createTask = async (req, res, next) => {
  try {
    const task = await PreparationTask.create(req.body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/tasks/:id
 * @desc    Update a preparation task
 */
export const updateTask = async (req, res, next) => {
  try {
    const task = await PreparationTask.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Preparation task not found with id: ${req.params.id}`
      });
    }

    // Apply updates and synchronize status/completed if modified
    Object.assign(task, req.body);

    if (req.body.completed !== undefined && req.body.status === undefined) {
      task.status = req.body.completed ? 'completed' : 'pending';
    } else if (req.body.status !== undefined && req.body.completed === undefined) {
      task.completed = req.body.status === 'completed';
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a preparation task
 */
export const deleteTask = async (req, res, next) => {
  try {
    const task = await PreparationTask.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Preparation task not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Preparation task deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};
