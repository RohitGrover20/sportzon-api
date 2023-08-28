const Classes = require("../../classes/Model");

module.exports = {
  getClasses: async (req, res) => {
    try {
      const classes = await Classes.find({}).sort({
        createdAt: -1,
      });
      if (classes) {
        return res.status(200).json({
          data: classes,
          message: "Classes has been fetched",
          code: "fetched",
        });
      }
    } catch (err) {
      return res.status(400).json({
        data: err,
        message: "Error occured",
        code: "error",
      });
    }
  },

  getClassesBySlug: async (req, res) => {
    try {
      const classes = await Classes.findOne({ slug: req.params.slug }).sort({
        createdAt: -1,
      });
      if (classes) {
        return res.status(200).json({
          code: "fetched",
          message: "Class has been fetched",
          data: classes,
        });
      }
    } catch (err) {
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: err,
      });
    }
  },

  getClassesByCoach: async (req, res) => {
    try {
      const classes = await Classes.find({
        coaches: { $elemMatch: { value: req.params.coachId } },
      });
      if (classes) {
        return res.status(200).json({
          code: "fetched",
          message: "Classes has been fetched",
          data: classes,
        });
      }
    } catch (err) {
      return res.status(200).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },
};
