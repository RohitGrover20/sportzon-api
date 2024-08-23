const Subscription = require("../../subscription/Model");
const { SubscriptionBooking } = require("../../subscriptionBookings/Model");

const Payment = require("../Models/Payments");
module.exports = {
  getSubscriptionPlan: async (req, res) => {
    try {
      const subscription = await Subscription.find({}).sort({ createdAt: -1 });
      if (subscription) {
        return res.status(200).json({
          code: "fetched",
          message: "subscription plan were fetched.",
          data: subscription,
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
  SubscriptionProcess: async (req, res) => {
    console.log(req.user , "user details")
    try {
        const payment = await Payment.create({
          user: req.user._id,
          razorpay_order_id: req?.body?.response?.razorpay_order_id,
          razorpay_payment_id: req?.body?.response?.razorpay_payment_id,
          razorpay_signature: req?.body?.response?.razorpay_signature,
          status: "paid",
        });

        // Create a Subscription Booking document
        const bookingData = {
          ...req.body.data,
          userDetails: req.user,
          user:req.user._id,
          bookingId:
            "BKG" +
            Math.floor(Math.random() * 100) +
            "SUBSCRIPTION" +
            new Date().getTime(),
          orderId: req?.body?.response?.razorpay_order_id,
          club: req.body.data.club,
          status: "Completed",
        };
        console.log(bookingData , "booking data")
        const booking = await SubscriptionBooking.create(bookingData);
        // await sendBookingEmail(req?.body?.data?.email, bookingData);
        // await sendBookingSMS(req?.body?.data?.mobile, bookingData);

        // Return the booking data in the response
        return res.status(200).json({
          code: "booked",
          message: "You are member of sportzon Now",
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
  mySubscriptions: async (req, res) => {
    try {
      const booking = await SubscriptionBooking.find({ user: req.user._id })
        .sort({ createdAt: -1 });
      if (booking) {
        return res.status(200).json({
          code: "fetched",
          message: "Subscriptions were fetched",
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
};
