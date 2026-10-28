import Resource from '../models/Resource.js';

/**
 * @route   GET /api/resources
 * @desc    Get all learning resources with optional filtering and sorting
 */
export const getResources = async (req, res, next) => {
  try {
    const { subjectId, resourceType, favorite, tag, search, sortBy } = req.query;

    const filter = {};

    if (subjectId) {
      filter.subjectId = subjectId;
    }

    if (resourceType) {
      filter.resourceType = resourceType;
    }

    if (favorite !== undefined) {
      filter.favorite = favorite === 'true';
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { topic: searchRegex },
        { description: searchRegex },
        { url: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'createdAtAsc') {
      sort = { createdAt: 1 };
    } else if (sortBy === 'titleAsc') {
      sort = { title: 1 };
    } else if (sortBy === 'subjectAsc') {
      sort = { subjectId: 1 };
    }

    const resources = await Resource.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/resources/:id
 * @desc    Get a single resource by ID
 */
export const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `Resource not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/resources
 * @desc    Create a new learning resource
 */
export const createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create(req.body);

    res.status(201).json({
      success: true,
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/resources/:id
 * @desc    Update a resource
 */
export const updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `Resource not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/resources/:id
 * @desc    Delete a resource
 */
export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `Resource not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};
