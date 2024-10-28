const Merchandise = require("../../merchandise/Model");

module.exports = {
  getMerchandise: async (req, res) => {
    try {
      const merchandise = await Merchandise.find().sort({ createdAt: -1 });
      if (merchandise) {
        return res.status(200).json({
          code: "fetched",
          message: "Merchandise were fetched",
          data: merchandise,
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
  getMerchandiseBySlug: async (req, res) => {
    try {
      const merchandise = await Merchandise.findOne({ slug: req?.params?.slug }).sort({
        createdAt: -1,
      });
      if (merchandise) {
        return res.status(200).json({
          code: "fetched",
          message: "Merchandise were fetched",
          data: merchandise,
        });
      }
    } catch (err) {
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: err,
      });
    }
  }
};
