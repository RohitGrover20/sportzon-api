const { default: mongoose } = require("mongoose");
const Arena = require("../../arenas/Model");
const { Booking } = require("../../bookings/Model");
const Event = require("../../events/Model");

module.exports = {
  getVenues: async (req, res) => {
    try {
      const venues = await Arena.find().sort({ createdAt: -1 });
      if (venues) {
        return res.status(200).json({
          code: "fetched",
          message: "Venues were fetched",
          data: venues,
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
  getVenueBySlug: async (req, res) => {
    try {
      const venues = await Arena.findOne({ slug: req.params.slug }).sort({
        createdAt: -1,
      });
      if (venues) {
        return res.status(200).json({
          code: "fetched",
          message: "Venues were fetched",
          data: venues,
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

  arenaSlotChecking: (req, res) => {
    let arena = new mongoose.Types.ObjectId(req.body.arena);
    Booking.aggregate([
      {
        $match: {
          arena: arena,
          bookingType: "arena",
          // status: 3
        },
      },
      {
        $project: {
          _id: 0,
          court: {
            $map: {
              input: "$court",
              as: "item",
              in: {
                activity: "$$item.activity",
                slots: "$$item.slots",
                date: "$$item.date",
                court: "$$item.court",
              },
            },
          },
        },
      },
      {
        $unwind: "$court",
      },
      {
        $replaceRoot: { newRoot: "$court" },
      },
      {
        $match: {
          date: { $gte: new Date().toISOString() },
        },
      },
    ])
      .then((result) => {
        return res.status(200).json({
          data: result,
          message: "Bookings were fetched",
          code: "fetched",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          data: err,
          message: "Something went wrong",
          code: "error",
        });
      });
  },
};
