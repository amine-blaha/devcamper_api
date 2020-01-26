const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

// @desc        Get Reviews
// @route       GET /api/v1/reviews
// @route       GET /api/v1/:bootcampId/reviews
// @access      Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc        Get single review
// @route       GET /api/v1/reviews/:id
// @access      Public
exports.getSingleReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name, description"
  });

  if (!review) {
    return next(new ErrorResponse("Not found", 404));
  }
  res.status(200).json({ success: true, data: review });
});

// @desc        add a review to a bootcamp
// @route       POST /api/v1/:bootcampId/reviews
// @access      Private
exports.addReview = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(new ErrorResponse("Not found", 404));
  }
  console.log(req.user.id);
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const review = await Review.create(req.body);

  if (!review) {
    return next(new ErrorResponse("Internal error", 500));
  }

  res.status(200).json({ success: true, data: review });
});

// @desc        update review
// @route       PUT /api/v1/reviews/:id
// @access      Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse("Not found", 404));
  }

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized", 400));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  await review.save();
  res.status(200).json({ success: true, data: review });
});

// @desc        delete review
// @route       DELETE /api/v1/reviews/:id
// @access      Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse("Not found", 404));
  }

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized", 400));
  }

  await review.remove();
  res.status(200).json({ success: true, data: {} });
});
