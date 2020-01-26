const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

// @desc        Get Courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/:bootcampId/courses
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc        Get a single course
// @route       GET /api/v1/courses/:id
// @access      Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    selec: "name description"
  });

  if (!course) {
    return next(new ErrorResponse("Course does not exit", 404));
  }

  res.status(200).json({ success: true, data: course });
});

// @desc        Add a course
// @route       POST /api/v1/bootcamps/:bootcampId/courses
// @access      Public
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(new ErrorResponse("Bootcamp does not exit", 404));
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized`, 401));
  }

  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

// @desc        Update add a course
// @route       PUT /api/v1/courses/:id
// @access      Public
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse("Course does not exit", 404));
  }

  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized`, 401));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });

  res.status(200).json({ success: true, data: course });
});

// @desc        Delete a course
// @route       DELETE /api/v1/courses/:id
// @access      Public
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse("Course does not exit", 404));
  }

  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized`, 401));
  }

  await course.remove();

  res.status(200).json({ success: true, data: course });
});
