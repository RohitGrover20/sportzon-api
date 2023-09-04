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
      const role = await Role.find({ club: req.user.club })
        .populate("club")
        .sort({ createdAt: -1 });
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
};
