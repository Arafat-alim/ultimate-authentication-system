const express = require("express");

const app = express();

//! Imports
const authRoutes = require("./routes/authRoutes");

//! Middleware
app.use("/api", authRoutes);

const PORT = process.env.port || 8000;

//! Listing server
app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
