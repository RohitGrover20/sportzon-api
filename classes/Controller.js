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
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Classes.find({});
      } else {
        query = Classes.find({ club: req.user.club });
      }

      // const classes = await query.sort({
      //   createdAt: -1,
      // });
      const [classes, totalClassesCount] = await Promise.all([
        query.sort({ createdAt: -1 }),
        Classes.countDocuments({ club: req.user.club }),
      ]);
      if (classes) {
        return res.status(200).json({
          classesCount:totalClassesCount,
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
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Classes.findOne({ _id: req.params.id });
      } else {
        query = Classes.findOne({ club: req.user.club, _id: req.params.id });
      }
      const classes = await query.sort({
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

  EditClass: async (req, res) => {
    try {
      const banner = req.file && req.file.location;
      const update = await Classes.findOneAndUpdate(
        {
          _id: req.body._id,
        },
        { ...req.body, banner: banner },
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
