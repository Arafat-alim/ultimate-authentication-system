const User = require("../models/user");
const jwt = require("jsonwebtoken");

//! sendgrid
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
      return res.status(400).res.json({
        error: "The Email ID is already Taken",
      });
    }
    //! creating signup token
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );
    //! Send token to email url to the user
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Account Activation Link",
      html: `
        <h1>Please use the link to activate your account</h1>
        <p>${process.env.CLIENT_URL}/auth/activate</p>
        <hr/>
        <p>This Email contain the sensitive Informtaion</p>
        <p>${process.env.CLIENT_URL}</p>
      `,
    };

    sgMail.send(emailData).then((sent) => {
      console.log("SIGNUP Email Sent");
      return res.json({
        message: ` Email has been sent to ${email}, Follow the instruction to activate your Account`,
      });
    });
  });
};
