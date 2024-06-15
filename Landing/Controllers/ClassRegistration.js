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
          studentId: "SPZ" + Math.floor(Math.random() * 9000) + 1000,
          admissionIn: req.body.class,
          lastFeesPaidOn: new Date().toISOString(),
          club: req.body.club,
        });
        if (registration) {
          const fees = await Fees.create({
            class: registration.admissionIn,
            student: registration._id,
            paymentMethod: "online",
            transactionId: req.body.response.razorpay_payment_id,
            club: req.body.club,
            subtotal: req.body.subtotal,
            gst: req.body.gst,
            totalAmount: req.body.totalAmount / 100,
            paidAmount: req.body.amount,
            paidOn: new Date().toISOString(),
            balance: req.body.balance,
            discount: req.body.discount,
            month: req.body.month,
            year: req.body.year,
            description: req.body.description,
            status: "paid",
          });
          if (fees) {
            return res.status(200).json({
              data: registration,
              message: "You were registered successfully.",
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
