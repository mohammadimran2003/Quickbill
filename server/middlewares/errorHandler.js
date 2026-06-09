// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Prisma errors

  console.log(err, "error from errorHandler");

  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: `${err.meta?.modelName} already exists`,
    });
  }
  if (err.code === "P2023") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Record not found",
    });
  }

  // Custom AppError
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown error
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorHandler;
