const Role = require("./Model");

module.exports = {
  addRole: async (req, res) => {
    try {
      const isRole = await Role.exists({
        slug: req.body.slug,
        club: req.body.club,
      });
      if (isRole) {
        return res.status(200).json({
          data: 0,
          message: "Role is already exists",
          code: "duplicate",
        });
      } else {
        const addRole = await Role.create({
          ...req.body,
        });
        if (addRole) {
          return res.status(200).json({
            data: addRole,
            message: "Role were added successfully",
            code: "created",
          });
        }
      }
    } catch (err) {
      return res.status(400).json({
        data: err,
        message: "Error occured",
        code: "error",
      });
    }
  },

  getRole: async (req, res) => {
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Role.find();
      } else {
        query = Role.find({ club: req.user.club });
      }
      const role = await query.populate("club").sort({ createdAt: -1 });
      return res.status(200).json({
        data: role,
        message: "Role were fetched",
        code: "fetched",
      });
    } catch (err) {
      return res.status(400).json({
        data: err,
        message: "Error occured",
        code: "error",
      });
    }
  },

  EditRole: async (req, res) => {
    try {
      const update = await Role.findOneAndUpdate(
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
