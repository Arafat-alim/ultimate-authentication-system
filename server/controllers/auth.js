const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { sendEmailWithNodemailer } = require("../helpers/email");

//! sendgrid
// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// module.exports.signup = (req, res) => {
//   //! console.log("REQ_BODY", req.body);
//   const { name, email, password } = req.body;
//   User.findOne({ email }).exec((err, user) => {
//     if (user) {
//       return res.status(400).json({
//         error: "Email is already taken",
//       });
//     }
//   });

//   let newUser = new User({ name, email, password });
//   newUser.save((err, success) => {
//     if (err) {
//       console.log("SIGNUP ERROR: ", err);
//       return res.status(400).json({
//         error: err,
//       });
//     }
//     res.json({
//       message: "Signup successful! Please signin",
//     });
//   });
// };

module.exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "The Email ID is already Taken",
      });
    }
    //! creating signup token
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    //! Generating Emaildata
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Account Activation Link",
      html: `
        <h1>Please use the link to activate your account</h1>
        <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
        <hr/>
        <p>This Email contain the sensitive Informtaion</p>
        <p>${process.env.CLIENT_URL}</p>
      `,
    };

    sendEmailWithNodemailer(req, res, emailData);

    //! Send token to email url to the user using SENDGRID
    // sgMail
    //   .send(emailData)
    //   .then((sent) => {
    //     console.log("SIGNUP Email Sent", sent);
    //     return res.json({
    //       message: ` Email has been sent to ${email}, Follow the instruction to activate your Account`,
    //     });
    //   })
    //   .catch((err) => {
    //     // console.log("SIGN UP Email Send Error");
    //     return res.status(400).json({
    //       message: err.message,
    //     });
    //   });
  });
};

module.exports.accountActivation = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR ", err);
          return res.status(401).json({
            error: "Expired Link, sign Up Again!",
          });
        }

        const { name, email, password } = jwt.decode(token);
        //! create a new User and save it into the database
        let user = new User({ name, email, password });
        user.save((err, user) => {
          if (err) {
            console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR ", err);
            return res.status(401).json({
              error: "Saving the user in the database. Try Again!",
            });
          }
          return res.json({
            message: "Sign Up Success. Please Login",
          });
        });
      }
    );
  } else {
    return res.json({
      message: "Something Went Wrong! Please Try Again",
    });
  }
};

//! Login
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exists. Please Signup",
      });
    }
    //! authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not matched!",
      });
    }
    //! generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    //! Pulled out the user information
    const { _id, name, email, role } = user;

    return res.json({
      token: token,
      user: { _id, name, email, role },
    });
  });
};

//! Middleware that gives us user_Id - explicit feature of express JWT
module.exports.requiredSignIn = expressJwt({
  secret: process.env.JWT_SECRET, //! req.user._id
});
