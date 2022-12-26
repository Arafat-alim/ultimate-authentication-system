const User = require("../models/user");

module.exports.read = (req, res) => {
  const userId = req.params.id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User Not Found",
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  });
};

//! req.user come from expressJWT
module.exports.update = (req, res) => {
  console.log("USER REQ", req.user);
  const { name, password } = req.body;
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User Not Found!",
      });
    }
    if (!name) {
      return res.status(400).json({
        error: "Name is Required",
      });
    } else {
      user.name = name;
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: "Password min length must be greater than 6 characters long",
        });
      } else {
        user.password = password;
      }
    }
    user.save((err, updatedUser) => {
      console.log("UPDATE USER FAILED ", err);
      if (err) {
        return res.status(400).json({
          error: "Update User Failed!",
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};
