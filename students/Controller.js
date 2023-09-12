const Fees = require("../fees/Model");
const Student = require("./Model");
const Court = require("./Model");

module.exports = {
  AddStudent: async (req, res) => {
    try {
      const isExists = await Student.exists({
        user: req.body.user,
        admissionIn: req.body.class,
      });
      if (isExists) {
        return res.status(200).json({
          code: "duplicate",
          data: 0,
          message: "Already Enrolled in this Class.",
        });
      } else {
        const student = await Student.create({
          ...req.body,
          admissionIn: req.body.class,
          lastFeesPaidOn: new Date().toISOString(),
          club: req.user.club,
        });

        if (student) {
          const fees = await Fees.create({
            class: student.admissionIn,
            student: student._id,
            subtotal: req.body.subtotal,
            gst: req.body.gst,
            totalAmount: req.body.totalAmount,
            paidAmount: req.body.paidAmount,
            balance: req.body.balance,
            month: "admission",
            year: "admission",
            discount: req.body.discount,
            description: "admission",
            status: "paid",
            paidOn: new Date().toISOString(),
            club: req.user.club,
          });
          if (fees) {
            return res.status(200).json({
              data: student,
              message: "You were registered successfully.",
              code: "created",
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        data: err,
        message: "Error Occured",
      });
    }
  },

  getStudentsInAClass: async (req, res) => {
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Student.find({
          admissionIn: req.params?.classes,
        });
      } else {
        query = Student.find({
          club: req.user.club,
          admissionIn: req.params?.classes,
        });
      }

      const students = await query.sort({ createdAt: "-1" });
      if (students) {
        return res.status(200).json({
          code: "fetched",
          message: "Students were fetched",
          data: students,
        });
      }
    } catch (err) {
      return res.status(200).json({
        code: "error",
        message: "Error Occured",
        data: err,
      });
    }
  },

  EditStudent: async (req, res) => {
    try {
      const update = await Student.findOneAndUpdate(
        {
          _id: req.body._id,
        },
        req.body,
        {
          new: true,
        }
      );

      if (update) {
        return res.status(200).json({
          code: "update",
          message: "Data were updated successfully.",
          data: update,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: err,
      });
    }
  },
};
