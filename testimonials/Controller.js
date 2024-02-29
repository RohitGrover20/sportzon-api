const Testimonials = require("../Landing/Controllers/Testimonials");
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

  EditTestimonials: async (req, res) => {
    try {
      const profile = req.file && req.file.location;
      const update = await Testimonial.findOneAndUpdate(
        {
          _id: req.body._id,
        },
        {
          ...req.body , profile:profile
        },
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
