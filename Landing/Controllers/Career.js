const Job = require("../../careers/Model");

module.exports = {
  Jobs: async (req, res) => {
    try {
      const jobs = await Job.find({}).sort({ createdAt: -1 });
      if (jobs) {
        return res.status(200).json({
          code: "fetched",
          message: "jobs were fetched.",
          data: jobs,
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
};