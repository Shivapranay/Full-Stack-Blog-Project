const globalErrorHandler = (err, req, res, next) => {
  const message = err.message;
  const stack = err.stack;
  const statusCode = err.statusCode ? err.statusCode : 500;
  const status = err.status ? err.status : "failed";

  // send response

  res.status(statusCode).json({
    message,
    stack,
    status,
  });
};


module.exports=globalErrorHandler;