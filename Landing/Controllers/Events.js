const Event = require("../../events/Model");

module.exports = {
  getEvents: async (req, res) => {
    try {
      const events = await Event.find().sort({ createdAt: -1 });
      if (events) {
        return res.status(200).json({
          code: "fetched",
          message: "Events were fetched",
          data: events,
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
  getEventBySlug: async (req, res) => {
    try {
      const events = await Event.findOne({ slug: req.params.slug }).sort({
        createdAt: -1,
      });
      if (events) {
        return res.status(200).json({
          code: "fetched",
          message: "Events were fetched",
          data: events,
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
};
