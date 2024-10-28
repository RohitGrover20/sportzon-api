const Merchandise = require("./Model");
const fs = require("fs");

module.exports = {
  addMerchandise: async (req, res) => {
    try {
      const isMerchandise = await Merchandise.exists({
        slug: req.body.slug,
        club: req.body.club,
      });
      if (isMerchandise) {
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
          message: "Merchandise is already exists",
          code: "duplicate",
        });
      } else {
        const gallery = req?.files && req.files.map((item) => item.location);
        const addMerchandise = await Merchandise.create({
          ...req.body,
          gallery: gallery,
          club: req.user.club,
        });
        if (addMerchandise) {
          return res.status(200).json({
            data: addMerchandise,
            message: "Merchandise were added successfully",
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

  getMerchandise: async (req, res) => {
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Merchandise.find();
      } else {
        query = Merchandise.find({ club: req.user.club });
      }

      const merchandise = await query.populate("club").sort({ createdAt: -1 });
      if (merchandise) {
        return res.status(200).json({
          data: merchandise,
          message: "Merchandise were fetched",
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

  editMerchandise: async (req, res) => {
    try {
      let bodyGallery = [];
      const gallery = req?.files && req.files.map((item) => item.location);
      if (req.body.gallery) {
        bodyGallery = req?.body?.gallery;
      }
      const update = await Merchandise.findOneAndUpdate(
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
