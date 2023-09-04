const Banner = require("./Model");
require("dotenv").config();

module.exports = {
  addBanner: async (req, res) => {
    try {
      const file = req.file && req.file.location;
      const bannerCheck = await Banner.exists({ slug: req.body.slug });
      if (!bannerCheck) {
        Banner.create({
          ...req.body,
          file: file,
          status: "active",
        })
          .then((result) => {
            return res.status(200).json({
              code: "created",
              data: result,
              message: "Banner were added successfully.",
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).json({
              code: "error",
              data: err,
              message: "Banner were added successfully.",
            });
          });
      } else if (bannerCheck) {
        return res.status(200).json({
          code: "duplicate",
          data: 0,
          message: "Banner already exists with this title.",
        });
      } else {
        return res.status(400).json({
          code: "error",
          data: 0,
          message: "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        data: err,
        message: "Something went wrong. Please try again.",
      });
    }
  },

  getBanners: async (req, res) => {
    let query;
    try {
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Banner.find();
      } else {
        query = Banner.find({ club: req.user.club });
      }
      const banner = await query.sort({
        createdAt: -1,
      });
      return res.status(200).json({
        data: banner,
        message: "Banner were fetched",
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
