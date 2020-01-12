const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/errors");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Database connection
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

app = express();

// Body Parser
app.use(express.json());

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.green
      .bold
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
