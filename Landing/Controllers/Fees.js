const Fees = require("../../fees/Model");

module.exports = {
  myFees: async (req, res) => {
    try {
      const classes = req.params.class;
      const student = req.params.student;
      const fees = await Fees.find({ student: student, class: classes }).sort({
        createdAt: "-1",
      });
      if (fees) {
        return res.status(200).json({
          code: 1,
          message: "Fees were fetched",
          data: fees,
        });
      }
    } catch (err) {
      return res.status(400).json({
        code: 0,
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },
};
