const Arena = require("./Model");
const fs = require("fs");

module.exports = {
  addArena: async (req, res) => {
    try {
      const isArena = await Arena.exists({
        slug: req.body.slug,
        club: req.body.club,
      });
      if (isArena) {
        req.files &&
          req.files.map((item, index) => {
            fs.unlink(item.path, (err) => {
              if (err) {
                throw err;
              }
              console.log("Delete File successfully.");
            });
          });

        return res.status(200).json({
          data: 0,
          message: "Arena is already exists",
          code: "duplicate",
        });
      } else {
        const gallery = req.files && req.files.map((item) => item.location);
        const addArena = await Arena.create({
          ...req.body,
          gallery: gallery,
          club: req.user.club,
        });
        if (addArena) {
          return res.status(200).json({
            data: addArena,
            message: "Arena were added successfully",
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

  getArena: async (req, res) => {
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Arena.find();
      } else {
        query = Arena.find({ club: req.user.club });
      }

      const arena = await query.populate("club").sort({ createdAt: -1 });
      if (arena) {
        return res.status(200).json({
          data: arena,
          message: "Arena were fetched",
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

  getArenaBySlugOrId: async (req, res) => {
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Arena.findOne({ slug: req.body.slug });
      } else {
        query = Arena.findOne({ slug: req.body.slug, club: req.user.club });
      }

      const arena = await query;
      if (arena) {
        return res.status(200).json({
          data: arena,
          message: "Arena were fetched",
          code: "fetched",
        });
      }
    } catch (error) {
      return res.status(200).json({
        data: error,
        message: "Something went wrong",
        code: "error",
      });
    }
  },

  EditArena: async (req, res) => {
    try {
      let bodyGallery = [];
      const gallery = req.files && req.files.map((item) => item.location);
      if (req.body.gallery) {
        bodyGallery = req?.body?.gallery;
      }
      const update = await Arena.findOneAndUpdate(
        {
          _id: req.body._id,
        },
        { ...req.body, gallery: [...gallery, ...bodyGallery] },
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
