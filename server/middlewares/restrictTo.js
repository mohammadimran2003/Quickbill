import AppError from "../lib/utils/AppError.js";

const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError("You are not logged in!", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("You are not authorized to perform this action", 403);
    }

    next();
  };
};

export default restrictTo;
