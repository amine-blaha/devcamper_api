const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const color = require("colors");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
Bootcamp = require("./models/Bootcamp");

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

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Data imported".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error.red);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
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
