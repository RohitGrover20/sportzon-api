const Reports = require("../../reports/Model");

module.exports = {
  myReports: async (req, res) => {
    try {
      const classes = req.params.class;
      const student = req.params.student;
      const report = await Reports.find({
        student: student,
        class: classes,
      }).sort({
        createdAt: "-1",
      });
      if (report) {
        return res.status(200).json({
          code: 1,
          message: "report were fetched",
          data: report,
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
