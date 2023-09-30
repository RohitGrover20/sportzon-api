const { sign } = require("jsonwebtoken");
const User = require("./Model");
const { hash, compare, hashSync } = require("bcrypt");

module.exports = {
  addUser: async (req, res) => {
    const profile = req.file && req.file.location;
    try {
      const isUser = await User.exists({
        $or: [{ mobile: req.body.mobile }, { email: req.body.email }],
      });
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
                profile: profile,
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
      const isUser = await User.findOne({ email: req.body.email });
      if (isUser) {
        if (req.body.socialLogin) {
          return res.status(200).json({
            data: 0,
            message: "You can proceed with social login",
            code: "proceed",
          });
        } else {
          compare(req.body.password, isUser.password, (err, result) => {
            if (!result) {
              return res.status(401).json({
                data: 0,
                message: "You have entered a wrong password. Please try again",
                code: "unauthorised",
              });
            } else if (result) {
              isUser.password = undefined;
              const token = sign({ isUser }, process.env.TOKEN_KEY, {
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
                message: "Logged in sucessfully",
                code: "authorised",
                verified: true,
              });
            } else {
              return res.status(400).json({
                data: err,
                message: "Error Occured",
                code: "error",
              });
            }
          });
        }
      } else {
        if (req.body.socialLogin) {
          const user = req.profile && req.profile._json;
          hash("TemporaryPassword@1000", 10, async (err, hash) => {
            if (hash) {
              const create = await User.create({
                firstName: user.given_name,
                lastName: user.family_name,
                profile: user.picture,
                email: user.email,
                mobile: "9999999999",
                password: hash,
                club: "64a7c238ce825993da286481",
                role: "64ba1e1408376a6fd50c50f2",
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
          return res.status(200).json({
            data: 0,
            message: "Logged in sucessfully",
            code: "authorised",
          });
        }
      }
    } catch (err) {
      return res.status(401).json({
        data: err,
        message: "Error Occured",
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
      const profile = req.file && req.file.location;
      const update = await User.findOneAndUpdate(
        {
          _id: req.body._id,
        },
        { ...req.body, profile: profile },
        {
          new: true,
        }
      );

      if (update) {
        return res.status(200).json({
          code: "update",
          message: "Data were updated successfully.",
          data: update,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: err,
      });
    }
  },

  forgetPassword: async (req, res) => {
    // const { mobile } = req.body;
    try {
      if (req.body.mobile == undefined) {
        res.send("Invalid request");
      } else {
        const user = await User.findOne({
          mobile: req.body.mobile,
        });
        if (user == null) {
          return res
            .status(404)
            .json({ message: "User not found", code: "notauser", data: 0 });
        } else {
          const updateUser = await User.findOneAndUpdate(
            { mobile: req.body.mobile },
            { userOtp: "178765" }
          );
          if (updateUser) {
            return res.status(200).json({
              code: "sent",
              message: "Otp sent",
              data: "",
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
        const verify = await User.findOne({
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
              data: {},
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
    console.log(req.body);
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
