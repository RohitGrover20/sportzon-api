const Coach = require("../../coaches/Model");

module.exports = {
  getCoachbyId: async (req, res) => {
    try {
      const coach = await Coach.findOne({ _id: req.params.coachId }).populate({
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
        ],
      });
      if (coach) {
        return res.status(200).json({
          code: "fetched",
          message: "Coach were fetched",
          data: coach,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Error Occured",
        data: err,
      });
    }
  },
};
