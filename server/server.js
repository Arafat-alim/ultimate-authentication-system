const express = require("express");

const app = express();

app.get("/api/signup", (req, res) => {
  res.json({
    data: "You hit the signup endpoints",
  });
});

const PORT = process.env.port || 8000;
//! Listing server
app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
