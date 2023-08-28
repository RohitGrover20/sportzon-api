const { sign } = require("jsonwebtoken");
const User = require("./Model");
const { hash, compare } = require("bcrypt");

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
              });
              if (addUser) {
                return res.status(200).json({
                  data: addUser,
                  message: "User has been added successfully",
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
      } else {
        return res.status(401).json({
          data: 0,
          message: "User with this email does not exists",
          code: "unauthorised",
        });
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
      const users = await User.find({ club: req.user.club }, { password: 0 })
        .populate(["role", "club"])
        .sort({ createdAt: -1 });
      if (users) {
        return res.status(200).json({
          code: "fetched",
          message: "Users has been fetched",
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
        { $match: { "role.slug": "coach" } },
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
          message: "Coaches have been fetched",
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
};
