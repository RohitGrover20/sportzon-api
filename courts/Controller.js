const Court = require("./Model");

module.exports = {
  addCourt: async (req, res) => {
    try {
      const isCourt = await Court.exists({
        slug: req.body.slug,
        club: req.body.club,
        arena: req.body.arena,
      });
      if (isCourt) {
        return res.status(200).json({
          data: 0,
          message: "Court is already exists",
          code: "duplicate",
        });
      } else {
        const addCourt = await Court.create({
          ...req.body,
          club: req.user.club,
        });
        if (addCourt) {
          return res.status(200).json({
            data: addCourt,
            message: "Court were added successfully",
            code: "created",
          });
        }
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

  getCourtinArena: async (req, res) => {
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Court.find({
          arena: req.body.arena,
        });
      } else {
        query = Court.find({
          club: req.user.club,
          arena: req.body.arena,
        });
      }
      const court = await query
        .populate(["arena", "club"])
        .sort({ createdAt: -1 });
      return res.status(200).json({
        data: court,
        message: "Court were fetched",
        code: "fetched",
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        data: err,
        message: "Error occured",
        code: "error",
      });
    }
  },

  EditCourt: async (req, res) => {
    try {
      const update = await Court.findOneAndUpdate(
        {
          _id: req.body._id,
        },
        { ...req.body },
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
