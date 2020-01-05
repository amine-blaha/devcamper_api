// @desc        GET all the bootcamps
// @route       /api/v1/bootcamps
// @access      Public
exports.getBootcamps = (req, res, next) => {
  res.json({ success: true, msg: "Get all bootcamps" }).send(200);
};

// @desc        Get a bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = (req, res, next) => {
  res
    .json({ success: true, msg: `Get bootcamp with id: ${req.params.id} ` })
    .send(200);
};

// @desc        Create a bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
exports.createBootcamp = (req, res, next) => {
  res.json({ success: true, msg: "Create bootcamp" }).send(200);
};

// @desc        Update a bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = (req, res, next) => {
  res
    .json({ success: true, msg: `Update bootcamp with id: ${req.params.id} ` })
    .send(200);
};

// @desc        Delete a bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .json({ success: true, msg: `Delete bootcamp with id: ${req.params.id} ` })
    .send(200);
};
