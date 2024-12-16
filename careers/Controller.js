const Job = require("./Model");
require("dotenv").config();

module.exports = {
  addJob: async (req, res) => {
    try {
      const jobCheck = await Job.exists({ title: req.body.title });
      if (!jobCheck) {
        Job.create({
          ...req.body,
          club: req.user.club,
        })
          .then((result) => {
            return res.status(200).json({
              code: "created",
              data: result,
              message: "Job were added successfully.",
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).json({
              code: "error",
              data: err,
              message: "Job were added successfully.",
            });
          });
      } else if (jobCheck) {
        return res.status(200).json({
          code: "duplicate",
          data: 0,
          message: "Job already exists with this title.",
        });
      } else {
        return res.status(400).json({
          code: "error",
          data: 0,
          message: "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        data: err,
        message: "Something went wrong. Please try again.",
      });
    }
  },

  getJobs: async (req, res) => {
    let query;
    try {
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Job.find();
      } else {
        query = Job.find({ club: req.user.club });
      }
      const job = await query.sort({
        createdAt: -1,
      });
      return res.status(200).json({
        data: job,
        message: "Job were fetched",
        code: "fetched",
      });
    } catch (err) {
      return res.status(400).json({
        data: err,
        message: "Error occured",
        code: "error",
      });
    }
  },
};
