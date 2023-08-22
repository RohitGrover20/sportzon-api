const Banner = require("../../banner/Model");

module.exports = {
  getBanner: async (req, res) => {
    try {
      const banners = await Banner.find().sort({ createdAt: -1 });
      if (banners) {
        return res.status(200).json({
          code: "fetched",
          message: "You banners has been fetched",
          data: banners,
        });
      }
    } catch (err) {
      return res.status(400).json({
        code: "error",
        message: "We couldn't fetched banners. Please try again",
        data: err,
      });
    }
  },
};
