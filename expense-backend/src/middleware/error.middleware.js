/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Check if error is a Prisma error
  if (err.code && err.code.startsWith('P')) {
    return handlePrismaError(err, res);
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * Handle Prisma specific errors
 */
const handlePrismaError = (err, res) => {
  switch (err.code) {
    case 'P2002': // Unique constraint violation
      return res.status(409).json({
        message: `Unique constraint violation on ${err.meta?.target}`
      });
    case 'P2025': // Record not found
      return res.status(404).json({
        message: 'Record not found'
      });
    default:
      return res.status(500).json({
        message: 'Database error',
        error: err.message
      });
  }
};

module.exports = {
  errorHandler
};