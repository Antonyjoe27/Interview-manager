import mongoose from 'mongoose';

/**
 * Middleware to validate MongoDB ObjectId parameters
 */
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format for parameter '${paramName}': ${id}`
      });
    }
    next();
  };
};

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
};

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID format: ${err.value}`;
  }

  // 2. Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // 3. JSON body parser syntax error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON payload received';
  }

  // 4. Duplicate Key Error (MongoDB E11000)
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
