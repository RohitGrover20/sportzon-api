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

  // arenaSlotChecking: (req, res) => {
  //   let arena = new mongoose.Types.ObjectId(req.body.arena);
  //   console.log(arena , "arena")
  //   Booking.aggregate([
  //     {
  //       $match: {
  //         arena: arena,
  //         bookingType: "arena",
  //         // status: 3
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 0,
  //         court: {
  //           $map: {
  //             input: "$court",
  //             as: "item",
  //             in: {
  //               activity: "$$item.activity",
  //               slots: "$$item.slots",
  //               date: "$$item.date",
  //               court: "$$item.court",
  //             },
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $unwind: "$court",
  //     },
  //     {
  //       $replaceRoot: { newRoot: "$court" },
  //     },
  //     {
  //       $match: {
  //         date: { $gte: new Date().toISOString() },
  //       },
  //     },
  //   ])
  //     .then((result) => {
  //       console.log(result , "reee")
  //       return res.status(200).json({
  //         data: result,
  //         message: "Bookings were fetched",
  //         code: "fetched",
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       return res.status(400).json({
  //         data: err,
  //         message: "Something went wrong",
  //         code: "error",
  //       });
  //     });
  // },

  arenaSlotChecking: async (req, res) => {
    try {
      let arena = new mongoose.Types.ObjectId(req.body.arena);
  
      // Step 1: Find bookings for the given arena
      let bookings = await Booking.find({
        arena: arena,
        bookingType: "arena",
        // status: 3
      });
  
      // Step 2: Filter out past dates and extract slots
      let slots = [];
      let today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Set time to start of the day in UTC
  
      bookings.forEach(booking => {
        booking.court.forEach(court => {
          let courtDate = new Date(court.date);
          courtDate.setUTCHours(0, 0, 0, 0); // Set time to start of the day in UTC
    
          if (courtDate >= today) {
            court.slots.forEach(slot => {
              slots.push({
                slot: slot,
                activity: court.activity,
                date: court.date,
                court: court.court,
              });
            });
          }
        });
      });
    
      // Step 3: Group slots by court
      let groupedSlots = {};
      slots.forEach(slot => {
        if (!groupedSlots[slot.court]) {
          groupedSlots[slot.court] = [];
        }
        groupedSlots[slot.court].push(slot);
      });
  
      // Convert groupedSlots object to an array format if necessary
      let result = Object.keys(groupedSlots).map(court => ({
        court: court,
        slots: groupedSlots[court],
      }));
  
      return res.status(200).json({
        data: result,
        message: "Bookings were fetched",
        code: "fetched",
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        data: err,
        message: "Something went wrong",
        code: "error",
      });
    }
  }
  
  
  
  
  
};
