const Fees = require("./Model");

module.exports = {
  addFees: (req, res) => {},

  feesOfStudentInClass: async (req, res) => {
    const classes = req.params.class;
    const student = req.params.student;
    try {
      const fees = await Fees.find({ class: classes, student: student }).sort({
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
