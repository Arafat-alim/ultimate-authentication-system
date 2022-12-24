module.exports.signup = (req, res) => {
  console.log("REQ_BODY", req.body);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    data: "You hit the signup endpoints",
  });
};
