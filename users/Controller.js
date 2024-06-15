const { sign } = require("jsonwebtoken");
const User = require("./Model");
const { hash, compare, hashSync  } = require("bcrypt");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  addUser: async (req, res) => {
    const profile = req.file && req.file.location;
    try {
      // const isUser = await User.exists({
      //   $or: [{ mobile: req.body.mobile }, { email: req?.body?.email }],
      // });
      let query = { mobile: req.body.mobile };

      // If email is provided, include it in the query
      if (req.body.email) {
        query = { $or: [{ mobile: req.body.mobile }, { email: req.body.email }] };
      }

      // Check if the user exists based on mobile number or email
      const isUser = await User.exists(query);
      if (isUser) {
        return res.status(200).json({
          data: 0,
          message: "User is already exists",
          code: "duplicate",
        });
      } else {
        hash(req.body.password, 10, async (err, hash) => {
          if (hash) {
            try {
              const addUser = await User.create({
                ...req.body,
                password: hash,
                profile: profile ? profile : null,
              });
              if (addUser) {
                return res.status(200).json({
                  data: addUser,
                  message: "User were added successfully",
                  code: "created",
                });
              }
            } catch (err) {
              return res.status(400).json({
                data: err,
                message: "Error occured",
                code: "error",
              });
            }
          }
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        data: err,
        message: "Error occured",
        code: "error",
      });
    }
  },
  
  login: async (req, res) => {
    try {
      let query;
      if (req.body.email && req.body.email.includes('@')) {
        query = { email: req.body.email };
      } else {
        query = { mobile: req.body.mobile || req.body.email }; // assuming mobile number might be sent as email in case no @
      }
  
      const isUser = await User.findOne(query);
  
      if (!isUser) {
        return res.status(401).json({
          message: "User not found",
          code: "unauthorised",
        });
      }
  
      if (req.body.socialLogin) {
        isUser.password = undefined;
        const token = jwt.sign({ isUser }, process.env.TOKEN_KEY, {
          expiresIn: "1d",
        });
        return res.status(200).json({
          data: {
            token: token,
            firstName: isUser.firstName,
            lastName: isUser.lastName,
            email: isUser.email,
            mobile: isUser.mobile,
            role: isUser.role,
            club: isUser.club,
          },
          message: "You can proceed with social login",
          code: "proceed",
        });
      } else {
        const enteredPassword = req.body.password;
        const storedPassword = isUser.password;
  
        if (!storedPassword) {
          return res.status(401).json({
            message: "Password is undefined",
            code: "error",
          });
        }
  
        // Properly using async/await for bcrypt.compare
        const isMatch = await bcrypt.compare(enteredPassword, storedPassword);
  
        if (!isMatch) {
          return res.status(401).json({
            message: "You have entered a wrong password. Please try again.",
            code: "unauthorised",
          });
        }
  
        isUser.password = undefined;
        const token = jwt.sign({ isUser }, process.env.TOKEN_KEY, {
          expiresIn: "1d",
        });
        return res.status(200).json({
          data: {
            firstName: isUser.firstName,
            lastName: isUser.lastName,
            email: isUser.email,
            mobile: isUser.mobile,
            role: isUser.role,
            club: isUser.club,
            token: token,
          },
          message: "Logged in successfully",
          code: "authorised",
          verified: true,
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({
        message: "Internal server error",
        code: "error",
      });
    }
  },
  getUser: async (req, res) => {
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = User.find({}, { password: 0 });
      } else {
        query = User.find({ club: req.user.club }, { password: 0 });
      }

      const users = await query
        .populate(["role", "club"])
        .sort({ createdAt: -1 });
      if (users) {
        return res.status(200).json({
          code: "fetched",
          message: "Users were fetched",
          data: users,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong",
        data: error,
      });
    }
  },

  getCoachUsers: async (req, res) => {
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = { "role.slug": "coach" };
      } else {
        query = { "role.slug": "coach", club: req.user.club };
      }
      const coaches = await User.aggregate([
        {
          $lookup: {
            from: "roles",
            localField: "role",
            foreignField: "_id",
            as: "role",
          },
        },
        { $unwind: "$role" },
        { $match: query },
        {
          $project: {
            role: 0,
            password: 0,
          },
        },
      ]);
      if (coaches) {
        return res.status(200).json({
          code: "fetched",
          message: "Coaches were fetched",
          data: coaches,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong",
        data: error,
      });
    }
  },
  EditUser: async (req, res) => {
    try {
      const { _id, ...userData } = req.body;
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({
          code: "not_found",
          message: "User not found",
        });
      }
  
      // Update user's details
      Object.assign(user, userData);
  
      // Hash the new password if provided
      if (userData?.password?.length>0) {
        const hashedNewPassword = await bcrypt.hash(userData.password, 10);
        user.password = hashedNewPassword;
      }
  
      // Save the updated user
      const updatedUser = await user.save();
  
      return res.status(200).json({
        code: "update",
        message: "User details updated successfully",
        data: updatedUser,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        code: "error",
        message: "Internal server error",
      });
    }
  },
  
  forgetPassword: async (req, res) => {
    const { mobile } = req.body;
    try {
      if (req.body.mobile == undefined) {
        res.send("Invalid request");
      } else {
        const user = await User.findOne({
          mobile: req.body.mobile,
        });
        if (user == null) {
          return res
            .status(400)
            .json({ message: "User not found", code: "notauser", data: 0 });
        } else {
          const updateUser = await User.findOneAndUpdate(
            { mobile: req.body.mobile }
            // { userOtp: "1234" }
            // {userOtp:user.body.otp}
          );
          if (updateUser) {
            return res.status(200).json({
              code: "sent",
              message: "Otp sent",
              data: false,
            });
          }
        }
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Server error" });
    }
  },
  verifyOtp: async (req, res) => {
    try {
      if (req.body.mobile == undefined || req.body.otp == undefined) {
        res.send("invalid request");
      } else {
        const verify = await User.exists({
          mobile: req.body.mobile,
          userOtp: req.body.otp,
        });
        if (verify !== null) {
          const updateUser = await User.findOneAndUpdate(
            { mobile: req.body.mobile },
            { OtpVerified: true, userOtp: null }
          );
          if (updateUser) {
            return res.status(200).json({
              code: "verified",
              data: 1,
              message: "User has been verified using OTP",
            });
          }
        } else {
          return res.status(400).json({
            code: "unverified",
            data: 0,
            message: "Invalid OTP",
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        data: 0,
        message: "Sorry, we couldn't verify using OTP",
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const isOtpVerified = await User.exists({
        mobile: req.body.mobile,
        OtpVerified: true,
      });
      if (isOtpVerified) {
        const reset = await User.findOneAndUpdate(
          { mobile: req.body.mobile },
          { OtpVerified: false, password: hashSync(req.body.newPassword, 10) }
        );

        if (reset) {
          return res.status(200).json({
            code: "update",
            data: 1,
            message: "Password has been updated",
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        data: 0,
        message: "Something went wrong",
      });
    }
  },
};
