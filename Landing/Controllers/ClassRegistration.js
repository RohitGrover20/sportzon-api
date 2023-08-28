const Fees = require("../../fees/Model");
const Student = require("../../students/Model");
const Payment = require("../Models/Payments");

module.exports = {
  classRegistration: async (req, res) => {
    try {
      const payment = await Payment.create({
        user: req.user._id,
        razorpay_order_id: req.body.response.razorpay_order_id,
        razorpay_payment_id: req.body.response.razorpay_payment_id,
        razorpay_signature: req.body.response.razorpay_signature,
        status: "paid",
      });

      if (payment) {
        const registration = await Student.create({
          ...req.body,
          user: req.user._id,
          admissionIn: req.body.class,
          lastFeesPaidOn: new Date().toISOString(),
          club: req.user.club,
        });
        if (registration) {
          const fees = await Fees.create({
            class: registration.admissionIn,
            student: registration._id,
            fees_amount: parseInt(req.body.amount),
            fees_month: "admission",
            fees_year: "admission",
            fees_description: "admission",
            status: "paid",
            paidOn: new Date().toISOString(),
            paymentMethod: "online",
            transactionId: req.body.response.razorpay_payment_id,
            club: req.user.club,
          });
          if (fees) {
            return res.status(200).json({
              data: registration,
              message: "You have been registered successfully.",
              code: "created",
            });
          }
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

  checkRegistration: async (req, res) => {
    try {
      const isRegistered = await Student.exists({
        user: req.user._id,
        admissionIn: req.body.class,
      });
      if (isRegistered) {
        return res.status(200).json({
          code: "duplicate",
          data: 0,
          message: "Already exists in our records.",
        });
      } else if (!isRegistered) {
        return res.status(200).json({
          code: "unique",
          data: 1,
          message: "This is the unique entry. Proceed",
        });
      }
    } catch (err) {
      return res.status(400).json({
        code: "error",
        data: err,
        message: "Error occured",
      });
    }
  },

  myRegisteredClasses: async (req, res) => {
    try {
      const myClasses = await Student.find({
        user: req.user._id,
      })
        .populate("admissionIn")
        .sort({ createdAt: "-1" });
      if (myClasses) {
        return res.status(200).json({
          message: "Classes were fetched",
          data: myClasses,
          code: "fetched",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        message: "Error Occured",
        data: err,
        code: "error",
      });
    }
  },
};
