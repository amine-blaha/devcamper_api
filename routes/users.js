const express = require("express");
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/users");

const User = require("../models/User");

const advancedResults = require("../middleware/advancedResults");

const { protect, authorized } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.use(authorized("admin"));

router
  .route("/")
  .get(advancedResults(User), getUsers)
  .post(createUser);
router
  .route("/:id")
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
