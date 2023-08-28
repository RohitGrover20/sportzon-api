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
          message: "You bookings has been fetched",
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

  Process: (req, res) => {
    Payment.create({
      user: req.user._id,
      razorpay_order_id: req.body.response.razorpay_order_id,
      razorpay_payment_id: req.body.response.razorpay_payment_id,
      razorpay_signature: req.body.response.razorpay_signature,
      status: "paid",
    })
      .then((result) => {
        const data = req.body.data;
        Booking.create({
          ...data,
          user: req.user._id,
          bookingId:
            "BKG" + Math.floor(Math.random() * 100) + data.bookingType &&
            data.bookingType.toUpperCase() + new Date().getTime(),
          orderId: req.body.response.razorpay_order_id,
          club: req.user.club,
          status: "upcoming",
        })
          .then(async (result) => {
            if (result.bookingType == "event") {
              try {
                const event = await Event.updateOne(
                  { _id: result.event },
                  { $inc: { emptySlots: -1 } }
                );
                if (event) {
                  return res.status(200).json({
                    code: "booked",
                    message: "Booking has been placed successfully",
                    data: result,
                  });
                }
              } catch (err) {
                res.status(400).json({
                  code: "error",
                  message: "Something went wrong. Please try again",
                  data: err,
                });
              }
            } else {
              return res.status(200).json({
                code: "booked",
                message: "Booking has been placed successfully",
                data: result,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({
              code: "error",
              message: "Something went wrong. Please try again",
              data: err,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          code: "error",
          message: "Something went wrong. Please try again",
          data: err,
        });
      });
  },
};
