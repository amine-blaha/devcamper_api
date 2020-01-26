const express = require("express");
const {
  getReviews,
  getSingleReview,
  addReview
} = require("../controllers/reviews");

const Review = require("../models/Review");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorized } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description"
    }),
    getReviews
  )
  .post(protect, authorized("user", "admin"), addReview);

router.route("/:id").get(protect, getSingleReview);

module.exports = router;
