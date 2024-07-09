const Testimonials = require("../Landing/Controllers/Testimonials");
const Testimonial = require("./Model");

module.exports = {
  addTestimonials: async (req, res) => {
    try {
      const profile = req.file && req.file.location;
      const testimonial = await Testimonial.create({
        ...req.body,
        profile: profile,
        user:req.user
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
   getTestimonials : async (req, res) => {
    const { role, club } = req.user;
    try {
      let query;
  
      // Check if user is super admin
      if (process.env.SUPERADMINROLE === role && process.env.SUPERADMINCLUB === club) {
        // Super admin: fetch all testimonials
        query = await Testimonial.find({}).sort({ createdAt: -1 });
      } else {
        // Regular user: fetch testimonials added by this user
        if(req?.user){
        query = await Testimonial.find({ user: req.user._id }).sort({ createdAt: -1 });
        }
        else{
          query=[]
        }
      }
      // const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
      if (query) {
        return res.status(200).json({
          code: "fetched",
          message: "Testimonials were fetched",
          data: query,
        });
      } else {
        return res.status(404).json({
          code: "not_found",
          message: "No testimonials found",
          data: null,
        });
      }
    } catch (err) {
      return res.status(500).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: err.message,
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
          ...req.body,
          profile: profile,
          user:req.user
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
