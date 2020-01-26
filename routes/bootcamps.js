const express = require("express");

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
  uploadBootcampPhoto
} = require("../controllers/bootcamps");

const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");

// Include other resource routers
const courseRouter = require("./courses");
const reviewsRouter = require("./reviews");

const { protect, authorized } = require("../middleware/auth");

const router = express.Router();

// Re-route to other resource router
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewsRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router
  .route("/:id/photo")
  .put(protect, authorized("admin", "publisher"), uploadBootcampPhoto);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorized("admin", "publisher"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorized("admin", "publisher"), updateBootcamp)
  .delete(protect, authorized("admin", "publisher"), deleteBootcamp);

module.exports = router;
