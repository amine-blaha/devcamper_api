const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courses");

const Courses = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorized } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Courses, {
      path: "bootcamp",
      select: "name description"
    }),
    getCourses
  )
  .post(protect, addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorized("admin", "publisher"), updateCourse)
  .delete(protect, authorized("admin", "publisher"), deleteCourse);

module.exports = router;
