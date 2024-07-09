const Razorpay = require("razorpay");
var crypto = require("crypto");
const Payment = require("../Models/Payments");
const { Booking } = require("../../bookings/Model");
const Event = require("../../events/Model");
var instance = new Razorpay({
  // key_id: "rzp_test_1KAe5ngzKfHbdN",
  key_id: "rzp_live_gk7iMvPaNzkvr2",
  // key_secret: "E8AIf2qY7LgKrWqcNqLejOQe",
  key_secret: "h69dp3cI8PwuMZUbjDfh2kfz",
});
module.exports = {
  Orders: (req, res) => {
    var options = {
      amount: req.body.amount, // amount in the smallest currency unit
      currency: "INR",
      // event:req.body.event,
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
    const { paymentMethod } = req.body.data;
    const response = req.body.response;
    // Skip payment verification if the payment method is cash on delivery
    if (paymentMethod === "Cash on Delivery") {
      return next();
    }

    if (
      !response ||
      !response.razorpay_order_id ||
      !response.razorpay_payment_id ||
      !response.razorpay_signature
    ) {
      return res.status(400).json({
        code: "error",
        message: "Missing required payment fields",
      });
    }

    let body = response.razorpay_order_id + "|" + response.razorpay_payment_id;
    let expectedSignature = crypto
      .createHmac("sha256", instance.key_secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === response.razorpay_signature) {
      next();
    } else {
      res.status(400).json({
        code: "error",
        message: "Invalid Signature",
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

  // RecentTransaction: async (req, res) => {
  //   try {
  //     const myPayment = await Payment.find(
  //       { user: req.user._id },
  //       { razorpay_payment_id: 1, _id: 0 }
  //     ).sort({ createdAt: -1 });
  //     // res.send(myPayment)
  //     console.log(myPayment , "mypayment")
  //     if (myPayment && myPayment.length > 0) {
  //       const promise = myPayment.map((item, index) => {
  //         return new Promise((resolve, reject) => {
  //           instance.payments
  //             .fetch(item.razorpay_payment_id)
  //             .then((result) => {
  //               return resolve(result);
  //             })
  //             .catch((err) => {
  //               return reject(err);
  //             });
  //         });
  //       });
  //       Promise.allSettled(promise)
  //         .then((values) => {
  //           console.log(promise , "promise" , values)

  //           return res.status(200).json({
  //             message: "Transactions were fetched",
  //             data: values,
  //             code: "fetched",
  //           });
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //           return res.status(200).json({
  //             message: "Couldn't fetched transactions. Please try again",
  //             data: err,
  //             code: "error",
  //           });
  //         });
  //     }
  //   } catch (err) {
  //     return res.status(200).json({
  //       message: "Couldn't fetched transactions. Please try again",
  //       data: err,
  //       code: "error",
  //     });
  //   }
  // },  
  

  RecentTransaction: async (req, res) => {
    try {
      // Check if req.user._id is defined
      if (!req.user || !req.user._id) {
        console.error("User ID not found in request");
        return res.status(400).json({
          message: "User ID is required",
          code: "error",
        });
      }
  
      // Fetch the user's payment IDs
      const myPayment = await Payment.find(
        { user: req.user._id },
        { razorpay_payment_id: 1, _id: 0 }
      ).sort({ createdAt: -1 });
  
      // If payments are found, fetch details from Razorpay
      if (myPayment && myPayment.length > 0) {
        const promise = myPayment.map((item) => {
          return new Promise((resolve, reject) => {
            instance.payments
              .fetch(item.razorpay_payment_id)
              .then((result) => {
                // Check if the status is not "Cash on Delivery"
                if (result.status !== "Cash on Delivery") {
                  resolve(result);
                } else {
                  resolve(null); // Resolve with null for Cash on Delivery transactions
                }
              })
              .catch((err) => {
                console.error(`Error fetching details for payment ID: ${item.razorpay_payment_id}`, err);
                reject(err);
              });
          });
        });
  
        Promise.allSettled(promise)
          .then((results) => {
            // Filter out null values (Cash on Delivery transactions)
            const filteredResults = results.filter((result) => result.status === "fulfilled" && result.value !== null);
            return res.status(200).json({
              message: "Transactions were fetched",
              data: filteredResults,
              code: "fetched",
            });
          })
          .catch((err) => {
            console.error("Error in promise.allSettled", err);
            return res.status(500).json({
              message: "Couldn't fetch transactions. Please try again",
              data: err,
              code: "error",
            });
          });
      } else {
        return res.status(200).json({
          message: "No transactions found",
          code: "no_transactions",
        });
      }
    } catch (err) {
      console.error("Error in RecentTransaction", err);
      return res.status(500).json({
        message: "Couldn't fetch transactions. Please try again",
        data: err,
        code: "error",
      });
    }
  }
  
};
