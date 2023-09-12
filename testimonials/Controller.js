const Testimonial = require("./Model");

module.exports = {
  addTestimonials: async (req, res) => {
    try {
      const profile = req.file && req.file.location;
      const testimonial = await Testimonial.create({
        ...req.body,
        profile: profile,
      });
      if (testimonial) {
        return res.status(200).json({
          data: testimonial,
          message: "Testimonial were added",
          code: "created",
        });
      }
    } catch (err) {
      return res.status(400).json({
        data: err,
        message: "Something went wrong. Please try again",
        code: "error",
      });
    }
  },
  getTestimonials: async (req, res) => {
    try {
      const testimonial = await Testimonial.find({}).sort({ createdAt: -1 });
      if (testimonial) {
        return res.status(200).json({
          code: "fetched",
          message: "Testimonials were fetched",
          data: testimonial,
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
