const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc        POST register
// @route       /api/v1/auth/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({ succes: true });
});
