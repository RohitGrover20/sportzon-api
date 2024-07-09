require("dotenv").config();
const { hash, compare, hashSync } = require("bcrypt");
const User = require("../../users/Model");
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const seriveId = process.env.TWILIO_VERIFY_SERVICE_ID

const client = require('twilio')(accountSid, authToken)
module.exports = {
  Register: async (req, res) => {
    try {
      const isRegistered = await User.exists({
        $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
      });
      if (isRegistered) {
        return res.status(200).json({
          data: 0,
          message: "User is already exists",
          code: "duplicate",
        });
      } else {
        if (req.body.socialLogin) {
          const user = req.body?.profile;
          hash("TemporaryPassword@1000", 10, async (err, hash) => {
            if (hash) {
              const create = await User.create({
                firstName: user.given_name,
                lastName: user.family_name,
                profile: user.picture,
                email: user.email,
                // mobile: "9999999999",
                mobile:user.mobile,
                password: hash,
                club: "64a7c238ce825993da286481",
                // role: "64ba1e1408376a6fd50c50f2",
                role: "66266f6f6fe30e2d45d65a04"
              });

              if (create) {
                create.password = undefined;
                return res.status(200).json({
                  data: create,
                  message: "Logged",
                  code: "unauthorised",
                });
              }
            }
          });
        } else {
          hash(req.body.password, 10, async (err, hash) => {
            if (hash) {
              if (hash) {
                const addUser = await User.create({
                  ...req.body,
                  // role: "64ba1e1408376a6fd50c50f2",
                  role: "66266f6f6fe30e2d45d65a04",
                  club: "64a7c238ce825993da286481",
                  password: hash,
                });
                if (addUser) {
                  return res.status(200).json({
                    data: addUser,
                    message: "Thankyou for signing up",
                    code: "created",
                  });
                }
              }
            }
          });
        }
      }
    } catch (err) {
      return res.status(400).json({
        data: err,
        message: "Couldn't proceed. Try again later",
        code: "error",
      });
    }
  },
  // Login: async (req, res) => {
  //     try {
  //         const user = await User.findOne({ email: req.body.email });
  //         if (!user) {
  //             return res.status(401).json({
  //                 data: 0,
  //                 message: "User with this email does not exists",
  //                 code: "unauthorised"
  //             })
  //         }
  //         else {
  //             const userPass = user.password;
  //             const matchPassword = await bcrypt.compare(req.body.password, userPass);
  //             if (matchPassword) {
  //                 user.password = undefined;
  //                 return res.status(200).json({
  //                     data: {
  //                         firstName: user.firstName,
  //                         lastName: user.lastName,
  //                         email: user.email,
  //                         mobile: user.mobile,
  //                         role: user.role,
  //                         club: user.club
  //                     },
  //                     message: "Logged in sucessfully",
  //                     code: "authorised",
  //                     verified: true
  //                 })
  //             }
  //             else {
  //                 return res.status(401).json({
  //                     data: 0,
  //                     message: "You have entered a wrong password. Please try again",
  //                     code: "unauthorised"
  //                 })
  //             }
  //         }
  //     }
  //     catch (err) {
  //         console.log(err)
  //         return res.status(401).json({
  //             data: err,
  //             message: "Error Occured",
  //             code: "error"
  //         })
  //     }
  // },

  profileUpdate: async (req, res) => {
    try {
      const update = await User.findOneAndUpdate(
        { _id: req.user._id },
        req.body,
        {
          new: true,
        }
      );
      if (update) {
        update.password = undefined;
        // persist the change to the session
        req.login(update, async (error) => {
          if (error) {
            return res.status(200).json({
              data: err,
              code: "error",
              message: "Sorry, there was an error updating your account.",
            });
          } else {
            return res.status(200).json({
              data: update,
              code: "updated",
              message: "Profile  were updated",
            });
          }
        });

        // return res.status(200).json({
        //   data: update,
        //   code: "updated",
        //   message: "Profile were updated successfully.",
        // });
      }
    } catch (err) {
      console.log(err);
      return res.status(200).json({
        data: err,
        code: "error",
        message: "Something went wrong. Please try again",
      });
    }
  },

  // passwordChange: async (req, res) => {
  //   try {
  //     const user = await User.findOne({ _id: req.user._id });
  //     if (user) {
  //       compare(req.body.oldPassword, user.password, (err, result) => {
  //         if (!result) {
  //           return res.status(401).json({
  //             code: "mismatched",
  //             message: "Password mismatched, Please use correct password",
  //             data: 0,
  //           });
  //         } else if (result) {
  //           User.findOneAndUpdate({
  //             _id: req.user._id,
  //             password: hashSync(req.body.newPassword, 10),
  //             new : true,
  //           })
  //             .then((result) => {
  //               return res.status(200).json({
  //                 code: "updated",
  //                 message: "Password were changed.",
  //                 data: 1,
  //               });
  //             })
  //             .catch((err) => {
  //               console.log(err);
  //               return res.status(400).json({
  //                 code: "error",
  //                 message: "Something went wrong. Please try again",
  //                 data: err,
  //               });
  //             });
  //         } else {
  //           console.log(err);
  //           return res.status(400).json({
  //             code: "error",
  //             message: "Something went wrong. Please try again",
  //             data: err,
  //           });
  //         }
  //       });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     return res.status(400).json({
  //       code: "error",
  //       message: "Something went wrong. Please try again",
  //       data: err,
  //     });
  //   }
  // },


  passwordChange: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user._id });
      if (!user) {
        return res.status(401).json({
          code: "unauthorized",
          message: "User not found",
          data: null,
        });
      }
  
      const passwordMatch = await compare(req.body.oldPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({
          code: "mismatched",
          message: "Password mismatched. Please use the correct password",
          data: null,
        });
      }
  
      const newPasswordHash = await hashSync(req.body.newPassword, 10);
  
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { password: newPasswordHash } },
        { new: true }
      );
      // Send SMS notification using Twilio
      // const phoneNumber = req?.user?.mobile; // Replace with actual user's phone number
      // const message = 'Your password has been changed successfully.';
      const message = await client.messages.create({
        body: "This is the ship that made the Kessel Run in fourteen parsecs?",
        from: "9466877709",
        to: "9466877709",
      });
      
      return res.status(200).json({
        code: "updated",
        message: "Password has been changed successfully",
        data: null,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: err.message,
      });
    }
  },
  
  
  
  ProfileImageUpdate: async (req, res) => {
    const profile = req.file && req.file.location;
    try {
      const update = await User.findOneAndUpdate(
        { _id: req.user._id },
        { profile: profile }
      );
      if (update) {
        const updatedUser = req.user;
        updatedUser.profile = profile;

        // persist the change to the session
        req.login(updatedUser, async (error) => {
          if (error) {
            return res.status(200).json({
              data: err,
              code: "error",
              message: "Sorry, there was an error updating your account.",
            });
          } else {
            return res.status(200).json({
              data: update,
              code: "updated",
              message: "Profile Image were updated",
            });
          }
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(200).json({
        data: err,
        code: "error",
        message: "Sorry, there was an error updating your account.",
      });
    }
  },
};
