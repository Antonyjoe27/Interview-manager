import Note from '../models/Note.js';

/**
 * @route   GET /api/notes
 * @desc    Get all revision notes with optional filtering and sorting
 */
export const getNotes = async (req, res, next) => {
  try {
    const { subjectId, favorite, pinned, tag, search, sortBy } = req.query;

    const filter = {};

    if (subjectId) {
      filter.subjectId = subjectId;
    }

    if (favorite !== undefined) {
      filter.favorite = favorite === 'true';
    }

    if (pinned !== undefined) {
      filter.pinned = pinned === 'true';
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { topic: searchRegex },
        { content: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    let sort = { pinned: -1, updatedAt: -1 };
    if (sortBy === 'createdAtDesc') {
      sort = { pinned: -1, createdAt: -1 };
    } else if (sortBy === 'titleAsc') {
      sort = { title: 1 };
    } else if (sortBy === 'subjectAsc') {
      sort = { subjectId: 1 };
    }

    const notes = await Note.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/notes/:id
 * @desc    Get a single note by ID
 */
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: `Note not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/notes
 * @desc    Create a new revision note
 */
export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);

    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/notes/:id
 * @desc    Update a note
 */
export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: `Note not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note
 */
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: `Note not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};
