const Razorpay = require("razorpay");
var crypto = require("crypto");
const Payment = require("../Models/Payments");
const { Booking } = require("../../bookings/Model");
const Event = require("../../events/Model");
var instance = new Razorpay({
  key_id: "rzp_test_UX09CkpYTnoeB5",
  key_secret: "RDFYvvs6b5ECg2Z6HYFupEgx",
});
module.exports = {
  Orders: (req, res) => {
    console.log("sdfds");
    var options = {
      amount: req.body.amount, // amount in the smallest currency unit
      currency: "INR",
    };

    if (req.body.bookingType == "event") {
      let query = Booking.exists({
        user: req.body.user,
        event: req.body.event,
      });
      query
        .then((result) => {
          if (!result) {
            Event.findOne({ _id: req.body.event, emptySlots: 0 })
              .then((result) => {
                if (result) {
                  return res.status(400).json({
                    code: "bookingclosed",
                    message:
                      "Sorry booking were closed. Please book another event",
                    data: 0,
                  });
                } else {
                  instance.orders.create(options, function (err, order) {
                    if (err) {
                      return res.status(400).json({
                        code: "error",
                        data: err,
                        message: "Order failed. Please try again",
                      });
                    } else {
                      return res.status(200).json({
                        code: "ordered",
                        data: order,
                        message: "Order placed successfully",
                      });
                    }
                  });
                }
              })
              .catch((error) => {
                console.log(error);
                return res.status(400).json({
                  code: "error",
                  data: error,
                  message: "Order failed. Please try again",
                });
              });
          } else {
            return res.status(200).json({
              code: "duplicate",
              message: "Booking already exists",
              data: 0,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json({
            code: "error",
            data: err,
            message: "Order failed. Please try again",
          });
        });
    } else {
      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log(err);
          return res.status(400).json({
            code: "error",
            data: err,
            message: "Order failed. Please try again",
          });
        } else {
          return res.status(200).json({
            code: "ordered",
            data: order,
            message: "Order placed successfully",
          });
        }
      });
    }
  },
  VerifyPayment: (req, res, next) => {
    let body =
      req.body.response.razorpay_order_id +
      "|" +
      req.body.response.razorpay_payment_id;
    var expectedSignature = crypto
      .createHmac("sha256", instance.key_secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === req.body.response.razorpay_signature) {
      next();
    } else {
      console.log(err);
      res.status(400).json({
        code: "error",
        message: "Invalid Signature",
        data: err,
      });
    }
  },

  failedPayment: (req, res) => {
    Payment.create({
      user: req.user._id,
      razorpay_order_id: req.body.order_id,
      razorpay_payment_id: req.body.payment_id,
      razorpay_signature: "invalid",
      status: req.body.status,
    })
      .then((result) => {
        return res.status(200).json({
          message: "Payment failed. Please try again",
          data: result,
          code: "paymentfailed",
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: "Something went wrong",
          data: err,
          code: "error",
        });
      });
  },

  RecentTransaction: async (req, res) => {
    try {
      const myPayment = await Payment.find(
        { user: req.user._id },
        { razorpay_payment_id: 1, _id: 0 }
      ).sort({ createdAt: -1 });
      // res.send(myPayment)
      if (myPayment && myPayment.length > 0) {
        const promise = myPayment.map((item, index) => {
          return new Promise((resolve, reject) => {
            instance.payments
              .fetch(item.razorpay_payment_id)
              .then((result) => {
                // console.log(result, "sdf")
                return resolve(result);
              })
              .catch((err) => {
                // console.log(err, "ppo")
                return reject(err);
              });
          });
        });

        Promise.allSettled(promise)
          .then((values) => {
            return res.status(200).json({
              message: "Transactions were fetched",
              data: values,
              code: "fetched",
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(200).json({
              message: "Couldn't fetched transactions. Please try again",
              data: err,
              code: "error",
            });
          });
      }
    } catch (err) {
      return res.status(200).json({
        message: "Couldn't fetched transactions. Please try again",
        data: err,
        code: "error",
      });
    }
  },
};
