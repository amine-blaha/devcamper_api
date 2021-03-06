const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const color = require("colors");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
Bootcamp = require("./models/Bootcamp");
Course = require("./models/Course");
Review = require("./models/Review");

// DB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// Read JSON file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await Review.create(reviews);

    console.log("Data imported".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error.red);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await Review.deleteMany();
    console.log("Data Deleted".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error.red);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
