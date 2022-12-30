const _ = require("lodash");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { sendEmailWithNodemailer } = require("../helpers/email");

const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");

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

//! Admin middleware
module.exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not Found",
      });
    }
    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin Resouces. Access Denied!",
      });
    }
    //! added new property named profile and store that admin data on it
    user.profile = user;
    next();
  });
};

module.exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that Email not Found",
      });
    }
    //! create a token
    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: "10m",
      }
    );
    //! Generating email Data
    const resetData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Account Reset Password Link",
      html: `
      <h1>Please use the following Link to Reset your Password</h1>
      <p>${process.env.CLIENT_URL}/auth/forgot/password/reset/${token}</p>
      <hr/>
      <p>This Email may contain the sensitive information</p>
      <p>${process.env.CLIENT_URL}</p>

      `,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        console.log("RESET PASSWORD LINK ERROR: ", err);
        return res.status(400).json({
          error: "Database connection error on user password forgot request",
        });
      } else {
        //! send the token via node Emailer package
        sendEmailWithNodemailer(req, res, resetData);
      }
    });
  });
};

module.exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function (err, decoded) {
        if (err) {
          console.log("", err);
          return res.status(400).json({
            error: "Expired Link! Try Again",
          });
        }
        User.findOne({ resetPasswordLink }).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "Something Went Wrong! Try Again",
            });
          }
          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };
          user = _.extend(user, updatedFields);
          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: "Error resetting user password",
              });
            }
            res.json({
              message: `Password Updated Successfully! Please Login!`,
            });
          });
        });
      }
    );
  }
};

// //! Google Auth
// // const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// exports.googleLogin = (req, res) => {
//   const { idToken } = req.body;

//   client
//     .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
//     .then((response) => {
//       console.log("GOOGLE LOGIN RESPONSE", response);
//       const { email_verified, name, email } = response.payload;
//       if (email_verified) {
//         //! find user in the database
//         User.findOne({ email }).exec((err, user) => {
//           if (user) {
//             const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//               expiresIn: "7d",
//             });
//             const { _id, name, email, role } = user;
//             return res.json({
//               token,
//               user: { _id, name, email, role },
//             });
//           } else {
//             //! creating a pssword on behalf of user - google login
//             let password = email + process.env.JWT_SECRET;
//             user = new User({ name, email, password });
//             user.save().exec((err, data) => {
//               if (err) {
//                 console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
//                 return res.status(400).json({
//                   error: "User Sign Up Failed with Google",
//                 });
//               }
//               const token = jwt.sign(
//                 { _id: data._id },
//                 process.env.JWT_SECRET,
//                 { expiresIn: "7d" }
//               );
//               const { name, user, email, role } = data;
//               return res.json({
//                 token,
//                 user: { name, user, email, role },
//               });
//             });
//           }
//         });
//       } else {
//         return res.status(400).json({
//           error: "Google Login Failed! Try Again",
//         });
//       }
//     });
// };

exports.googleLogin = (req, res) => {
  const { idToken } = req.body;

  //! decode the idToken using jsonwebtoken
  const { name, email, email_verified } = jwt.decode(idToken);
  if (email_verified) {
    //! Find user in the database
    User.findOne({ email }).exec((err, user) => {
      if (user) {
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        const { _id, name, email, role } = user;
        return res.json({
          token,
          user: { _id, name, email, role },
        });
      } else {
        //! creating a password on behalf of user
        const password = email + process.env.JWT_SECRET;
        //! creating a new user
        user = new User({ name, email, password });
        user.save().exec((err, data) => {
          if (err) {
            console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
            return res.status(400).json({
              error: "User Sign Up Failed with Google",
            });
          }
          const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });
          const { name, user, email, role } = data;
          return res.json({
            token,
            user: { name, user, email, role },
          });
        });
      }
    });
  } else {
    return res.status(400).json({
      error: "Google Login Failed! Try Again",
    });
  }
};

//! Facebook auth
exports.facebookLogin = (req, res) => {
  console.log("FACEBOOK LOGIN REQ BODY", req.body);
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return (
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      // .then(response => console.log(response))
      .then((response) => {
        const { email, name } = response;
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with facebook",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      })
      .catch((error) => {
        res.json({
          error: "Facebook login failed. Try later",
        });
      })
  );
};
