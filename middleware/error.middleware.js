const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack); // for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export default errorMiddleware;
