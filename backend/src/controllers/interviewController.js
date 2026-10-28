import Interview from '../models/Interview.js';

/**
 * @route   GET /api/interviews
 * @desc    Get all interviews with optional filtering and sorting
 */
export const getInterviews = async (req, res, next) => {
  try {
    const { status, stage, date, company, search, sortBy } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (stage) {
      filter.stage = stage;
    }

    if (date) {
      filter.date = date;
    }

    if (company) {
      filter.company = new RegExp(company.trim(), 'i');
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { company: searchRegex },
        { role: searchRegex },
        { stage: searchRegex },
        { notes: searchRegex }
      ];
    }

    let sort = { date: 1, time: 1 };
    if (sortBy === 'dateDesc') {
      sort = { date: -1, time: -1 };
    } else if (sortBy === 'createdAtDesc') {
      sort = { createdAt: -1 };
    } else if (sortBy === 'companyAsc') {
      sort = { company: 1 };
    }

    const interviews = await Interview.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/interviews/:id
 * @desc    Get a single interview by ID
 */
export const getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: `Interview not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/interviews
 * @desc    Create a new interview
 */
export const createInterview = async (req, res, next) => {
  try {
    const interview = await Interview.create(req.body);

    res.status(201).json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/interviews/:id
 * @desc    Update an interview
 */
export const updateInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: `Interview not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/interviews/:id
 * @desc    Delete an interview
 */
export const deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: `Interview not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Interview deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};
