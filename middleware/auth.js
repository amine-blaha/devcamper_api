const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } /*else if (req.cookies.token) {
    token = req.cookies.token;
  }*/

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("!user");
      return next(new ErrorResponse("Not authorized", 401));
    }

    req.user = user;

    console.log("after user");

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized", 401));
  }
});

exports.authorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse("Not authorized", 403));
    }

    next();
  };
};
