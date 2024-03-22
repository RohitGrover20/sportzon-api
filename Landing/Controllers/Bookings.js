const { Booking } = require("../../bookings/Model");
const Event = require("../../events/Model");
const Payment = require("../Models/Payments");
module.exports = {
  myBookings: async (req, res) => {
    try {
      const booking = await Booking.find({ user: req.user._id })
        .populate(["arena", "court", "event"])
        .sort({ createdAt: -1 });
      if (booking) {
        return res.status(200).json({
          code: "fetched",
          message: "You bookings were fetched",
          data: booking,
        });
      }
    } catch (err) {
      return res.status(400).json({
        code: "error",
        message: "We couldn't fetched booking. Please try again",
        data: err,
      });
    }
  },

// Process: async (req, res) => {
//   try {
//     // Create a Payment document
//     const payment = await Payment.create({
//       user: req.user._id,
//       razorpay_order_id: req.body.response.razorpay_order_id,
//       razorpay_payment_id: req.body.response.razorpay_payment_id,
//       razorpay_signature: req.body.response.razorpay_signature,
//       status: "paid",
//     });

//     // Create a Booking document
//     const bookingData = {
//       ...req.body.data,
//       user: req.user._id,
//       bookingId: "BKG" + Math.floor(Math.random() * 100) + req.body.data.bookingType.toUpperCase() + new Date().getTime(),
//       orderId: req.body.response.razorpay_order_id,
//       club: req.body.data.club,
//       status: "upcoming",
//     };
//     const booking = await Booking.create(bookingData);

//     // If booking type is event, update the emptySlots field in the corresponding Event document
//     if (bookingData.bookingType === "event") {
//       const event = await Event.updateOne(
//         { _id: bookingData.event },
//         { $inc: { emptySlots: -1 } }
//       );
//       if (!event) {
//         throw new Error("Failed to update event slots");
//       }
//     }

//     // Return the booking data in the response
//     return res.status(200).json({
//       code: "booked",
//       message: "Booking placed successfully",
//       data: booking,
//     });
//   } catch (error) {
//     console.error("Error processing booking:", error);
//     return res.status(400).json({
//       code: "error",
//       message: "Something went wrong. Please try again",
//       data: error.message,
//     });
//   }
// },
Process: async (req, res) => {
  try {
    // Create a Payment document
    const payment = await Payment.create({
      user: req.user._id,
      razorpay_order_id: req.body.response.razorpay_order_id,
      razorpay_payment_id: req.body.response.razorpay_payment_id,
      razorpay_signature: req.body.response.razorpay_signature,
      status: "paid",
    });

    // Create a Booking document
    const bookingData = {
      ...req.body.data,
      user: req.user._id,
      bookingId: "BKG" + Math.floor(Math.random() * 100) + req.body.data.bookingType.toUpperCase() + new Date().getTime(),
      orderId: req.body.response.razorpay_order_id,
      club: req.body.data.club,
      status: "upcoming",
    };
    const booking = await Booking.create(bookingData);

    // If booking type is event, update the emptySlots field in the corresponding Event document
    if (bookingData.bookingType === "event") {
      const event = await Event.updateOne(
        { _id: bookingData.event },
        { $inc: { emptySlots: -1 } }
      );
      if (!event) {
        throw new Error("Failed to update event slots");
      }
    }

    // Return the booking data in the response
    return res.status(200).json({
      code: "booked",
      message: "Booking placed successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error processing booking:", error);
    return res.status(400).json({
      code: "error",
      message: "Something went wrong. Please try again",
      data: error.message,
    });
  }
},

};
