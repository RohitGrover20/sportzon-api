const Classes = require("./Model");

module.exports = {
  addClasses: async (req, res) => {
    const banner = req.file && req.file.location;
    try {
      const isClasses = await Classes.exists({
        slug: req.body.slug,
        fees: req.body.fees,
        club: req.user.club,
      });
      if (isClasses) {
        return res.status(200).json({
          data: 0,
          message: "Class is already exists",
          code: "duplicate",
        });
      } else {
        const addClasses = await Classes.create({
          ...req.body,
          banner: banner,
          club: req.user.club,
        });
        if (addClasses) {
          return res.status(200).json({
            data: addClasses,
            message: "Classes were added successfully",
            code: "created",
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        data: err,
        message: "Something went wrong. Please try again.",
        code: "error",
      });
    }
  },

  getClasses: async (req, res) => {
    try {
      const classes = await Classes.find({ club: req.user.club }).sort({
        createdAt: -1,
      });
      if (classes) {
        return res.status(200).json({
          data: classes,
          message: "Classes were fetched",
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

  getClassById: async (req, res) => {
    try {
      const classes = await Classes.findOne({
        club: req.user.club,
        _id: req.params.id,
      }).sort({
        createdAt: -1,
      });
      if (classes) {
        return res.status(200).json({
          data: classes,
          message: "Class were fetched",
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
};
