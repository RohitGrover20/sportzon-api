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
            message: "Coach has been created successfully.",
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
    try {
      const coaches = await Coach.find({ club: req.user.club })
        .populate(["user"])
        .sort({ createdAt: -1 });
      if (coaches) {
        return res.status(200).json({
          code: "fetched",
          message: "Coaches has been fetched",
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
};
