const Testimonial = require("../../testimonials/Model");

module.exports = {
  Testimonials: async (req, res) => {
    try {
      const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
      if (testimonials) {
        return res.status(200).json({
          code: "fetched",
          message: "testimonials were fetched.",
          data: testimonials,
        });
      }
    } catch (err) {
      return res.status(200).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: err,
      });
    }
  },
};
