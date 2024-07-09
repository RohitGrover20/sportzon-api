const Role = require("../roles/Model");
const User = require("../users/Model");
const Coach = require("./Model");

module.exports = {
  addCoach: async (req, res) => {
    try {
      const checkCoach = await Coach.exists({
        club: req.user.club,
        user: req.body.user,
      });
      if (checkCoach) {
        return res.status(200).json({
          code: "duplicate",
          message: "Coach already exists",
          data: 0,
        });
      } else {
        const coach = await Coach.create({
          ...req.body,
          club: req.user.club,
        });
        if (coach) {
          return res.status(200).json({
            code: "created",
            data: coach,
            message: "Coach were created successfully.",
          });
        }
      }
    } catch (err) {
      return res.status(400).json({
        code: "error",
        message: "Error Occured",
        data: err,
      });
    }
  },
  getCoaches: async (req, res) => {
    const user = await Role.findById(req.user.role);
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Coach.find();
      } else if((user?.title === 'Coach')){
        query = Coach.find({ club: req.user.club, user: req.user._id });
      }
      else {
        query = Coach.find({ club: req.user.club });
      }
      const coaches = await query
        .populate({
          path: "user",
          select: [
            "firstName",
            "lastName",
            "gender",
            "city",
            "state",
            "role",
            "club",
            "profile",
            "email",
            "mobile",
          ],
          options: { maxDepth: 1 } 
        })
        // .sort({ createdAt: -1 })
        // .exec();
      if (coaches) {
        return res.status(200).json({
          code: "fetched",
          message: "Coaches were fetched",
          data: coaches,
        });
      }
    } catch (error) {
      return res.status(400).json({
        code: "error",
        message: "Something went wrong",
        data: error,
      });
    }
  },

  EditCoach: async (req, res) => {
    try {
      const update = await Coach.findOneAndUpdate(
        {
          _id: req.body._id,
        },
        req.body,
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
};
