const mongoose = require("mongoose");
const crypto = require("crypto"); // ! Inbuilt node module

//! SChema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trime: true,
      max: 32,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: "subscriber",
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

//! Virtual - convert the normal password coming from the client side and convert it into the hashed password
//! saved the password into the database
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

//! Methods
userSchema.methods = {
  //! AUthenticate
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

module.exports = mongoose.model("User", userSchema);
