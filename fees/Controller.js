const Fees = require("./Model");

module.exports = {
  addFees: async (req, res) => {
    try {
      const fees = await Fees.create({
        ...req.body,
        status: "paid",
        month: new Date(req.body.month).getMonth(),
        year: new Date(req.body.month).getFullYear(),
        club: req.user.club,
      });
      if (fees) {
        return res.status(200).json({
          code: "created",
          message: " fees were collected",
          data: fees,
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

  feesOfStudentInClass: async (req, res) => {
    const classes = req.params.class;
    const student = req.params.student;
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Fees.find({ class: classes, student: student });
      } else {
        query = Fees.find({
          class: classes,
          student: student,
          club: req.user.club,
        });
      }
      const fees = await query.populate("class").sort({
        createdAt: "-1",
      });
      if (fees) {
        return res.status(200).json({
          code: "fetched",
          message: "fees were fetched",
          data: fees,
        });
      }
    } catch (err) {
      return res.status(400).json({
        code: 0,
        message: "Error Occured",
        data: err,
      });
    }
  },
};
