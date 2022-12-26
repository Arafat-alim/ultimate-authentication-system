const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

//! Connect to DB
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB is connected Successfully"))
  .catch((err) => console.log("DB is not Connected!", err));

//! App middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
// app.use(cors()); // allows all origins

if ((process.env.NODE_ENV = "development")) {
  app.use(cors({ origin: "http://localhost:3000" }));
}
//! Imports routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

//! Middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);

const PORT = process.env.PORT || 8000;

//! Listing server
app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT} - ${process.env.NODE_ENV}`);
});
