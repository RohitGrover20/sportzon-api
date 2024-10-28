const { Booking } = require("./Model");

module.exports = {
  eventBooking: async (req, res) => {
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Booking.find({ bookingType: "event" });
      } else {
        query = Booking.find({ club: req.user.club, bookingType: "event" });
      }
      const [event, totalEventsCount] = await Promise.all([
        query.sort({ createdAt: -1 }),
        Booking.countDocuments({ club: req.user.club }),
      ]);
      if (event) {
        return res.status(200).json({
          totalEventsCount: totalEventsCount,
          code: "fetched",
          data: event,
          message: "Event Booking were fetched",
        });
      }
    } catch (err) {
      return res.status(400).json({
        code: "error",
        data: err,
        message: "Something went wrong",
      });
    }
  },

  arenaBooking: async (req, res) => {
    try {
      let query;
  
      // If the logged-in user is a super admin, fetch all bookings
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = {}; // Fetch all bookings without filtering by club
      } else {
        // Otherwise, fetch bookings for the specific user's club
        query = {
          club: req.user.club,
          bookingType: "arena",
        };
      }
  
      // Fetch bookings based on the query
      const booking = await Booking.find(query)
        .populate(["arena", "court"])
        .sort({ createdAt: "-1" });
  
      if (booking) {
        return res.status(200).json({
          code: "fetched",
          data: booking,
          message: "Arena bookings were fetched",
        });
      }
    } catch (err) {
      return res.status(400).json({
        code: "error",
        data: err,
        message: "Something went wrong",
      });
    }
  },

  addBooking: async (req, res) => {
    try {
      let query = "";
      const BookingType = req.body.bookingType;
      if (BookingType == "event") {
        query = await Booking.exists({
          event: req.body.event,
          user: req.body.user,
        });
      } else {
        query = await Booking.exists({
          arena: req.body.arena,
          user: req.body.user,
        });
      }

      if (query) {
        res.status(200).json({
          data: 0,
          message: "Booking is already exists",
          code: "duplicate",
        });
      } else {
        const bookingId = `${req.body.bookingType.toUpperCase()}BKG${Date.now()}`;
        const addBooking = await Booking.create({
          ...req.body,
          bookingId: bookingId,
        });
        if (addBooking) {
          return res.status(200).json({
            data: addBooking,
            message: "Booking were added successfully",
            code: "created",
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        data: err,
        message: "Error occured",
        code: "error",
      });
    }
  },

  updateBooking: async (req, res) => {
    try {
      let update;
      if (req.body.type == "arena") {
        updateArena = await Booking.findOneAndUpdate(
          { _id: req.body._id },
          {
            $set: {
              "court.$[item].status": req.body.status,
            },
          },
          {
            arrayFilters: [
              {
                "item.court": {
                  $eq: req.body.court,
                },
              },
            ],
            multi: true,
          }
        );
        if (updateArena) {
          return res.status(200).json({
            code: "updated",
            message: "Booking were updated successfully.",
            data: updateArena,
          });
        }
      } else {
        updateEvent = await Booking.findOneAndUpdate(
          { _id: req.body._id },
          {
            $set: {
              eventStatus: req.body.status,
            },
          }
        );
        if (updateEvent) {
          return res.status(200).json({
            code: "updated",
            message: "Booking were updated successfully.",
            data: updateEvent,
          });
        }
      }
    } catch (err) {
      return res.status(200).json({
        code: "error",
        message: "Error Occured.",
        data: err,
      });
    }
  },
};
