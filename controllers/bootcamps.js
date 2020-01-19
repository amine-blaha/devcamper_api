const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const geocoder = require("../utils/geocoder");
const asyncHandler = require("../middleware/async");

// @desc        GET all the bootcamps
// @route       /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  console.log(reqQuery);

  // Fields to execute
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);
  console.log(reqQuery);

  let queryStr = JSON.stringify(reqQuery);

  // Operator creation
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  console.log(queryStr);

  query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIdex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIdex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  query = query.skip(startIdex).limit(limit);

  const bootcamps = await query;

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps
  });
});

// @desc        Get a bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  console.log("inside try".blue);

  if (!bootcamp) {
    console.log("inside !bootcamp".blue);
    return next(
      new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc        Create a bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};

// @desc        Update a bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc        Delete a bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc        Get a bootcamp within a radius
// @route       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Public
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  console.log(zipcode.blue);

  // get lat/long from geocoder
  const loc = await geocoder.geocode(zipcode);
  console.log(loc);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calculating the radius using radians
  // Divide distance / radius of earth
  // Earth radius = 3,963 miles = 6,378 km

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc        Upload a bootcamp photo
// @route       PUT /api/v1/bootcamps/:id/photo
// @access      Private
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`No photo found`, 404));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image with a size les than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      return next(new ErrorResponse(`Server error`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({ success: true, data: file.name });
  });
});
