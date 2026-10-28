import JobApplication from '../models/JobApplication.js';

/**
 * @route   GET /api/applications
 * @desc    Get all job applications with optional filtering and sorting
 */
export const getApplications = async (req, res, next) => {
  try {
    const { status, workMode, jobType, company, search, sortBy } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (workMode) {
      filter.workMode = workMode;
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (company) {
      filter.company = new RegExp(company.trim(), 'i');
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { company: searchRegex },
        { role: searchRegex },
        { location: searchRegex },
        { contactName: searchRegex },
        { notes: searchRegex }
      ];
    }

    let sort = { applicationDate: -1 };
    if (sortBy === 'applicationDateAsc') {
      sort = { applicationDate: 1 };
    } else if (sortBy === 'companyAsc') {
      sort = { company: 1 };
    } else if (sortBy === 'deadlineAsc') {
      sort = { deadline: 1 };
    } else if (sortBy === 'followUpAsc') {
      sort = { followUpDate: 1 };
    }

    const applications = await JobApplication.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/applications/:id
 * @desc    Get a single job application by ID
 */
export const getApplicationById = async (req, res, next) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Job application not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/applications
 * @desc    Create a new job application
 */
export const createApplication = async (req, res, next) => {
  try {
    const application = await JobApplication.create(req.body);

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/applications/:id
 * @desc    Update a job application
 */
export const updateApplication = async (req, res, next) => {
  try {
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Job application not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/applications/:id
 * @desc    Delete a job application
 */
export const deleteApplication = async (req, res, next) => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Job application not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job application deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};
