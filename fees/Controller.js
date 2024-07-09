const Fees = require("./Model");
const Classes = require("../classes/Model");
const Role = require("../roles/Model");
const Coach = require("../coaches/Model");

module.exports = {
  addFees: async (req, res) => {
    try {
      const fees = await Fees.create({
        ...req.body,
        status: "paid",
        month: new Date(req?.body?.paidOn).getMonth(),
        year: new Date(req?.body?.paidOn).getFullYear(),
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

  // feesOfStudentInClass: async (req, res) => {
  //   const classes = req.params.class;
  //   const student = req.params.student;
  //   try {
  //     let query;
  //     if (
  //       process.env.SUPERADMINROLE == req.user.role &&
  //       process.env.SUPERADMINCLUB == req.user.club
  //     ) {
  //       query = Fees.find({ class: classes, student: student });
  //     } else {
  //       query = Fees.find({
  //         class: classes,
  //         student: student,
  //         club: req.user.club,
  //       });
  //     }
  //     const fees = await query.populate("class").sort({
  //       createdAt: "-1",
  //     });
  //     if (fees) {
  //       return res.status(200).json({
  //         code: "fetched",
  //         message: "fees were fetched",
  //         data: fees,
  //       });
  //     }
  //   } catch (err) {
  //     return res.status(400).json({
  //       code: 0,
  //       message: "Error Occured",
  //       data: err,
  //     });
  //   }
  // },

  feesOfStudentInClass: async (req, res) => {
    const student = req.params.student;
    const userClub = req.user.club;
    // For Different Club
    const classes = await Classes.find().sort({ createdAt: -1 }).exec();

    const filteredClasses = classes.filter(
      (cls) => cls._id == req.params.class
    );

    if (filteredClasses[0].club != userClub) {
      return res.status(403).json({
        code: "error",
        message: "Unauthorized access. Coach is not assigned to this class.",
      });
    }
    try {
      // Fetch user role and coach details based on the logged-in user
      const userRole = await Role.findById(req.user.role);
      const coachDetails = await Coach.findOne({ user: req.user._id });

      let query;

      // If user is a coach, check if they are assigned to the class
      if (userRole?.title === "Coach") {
        const classes = await Classes.find().sort({ createdAt: -1 }).exec();

        // Filter classes to find if coach has access to the requested class
        const filteredClasses = classes.filter((cls) =>
          cls.coaches.some(
            (coach) => coach.value.toString() === coachDetails._id.toString()
          )
        );

        // Check if coach has access to the requested class
        const hasAccess = filteredClasses.some(
          (cls) => cls._id.toString() === req.params.class
        );
        if (!hasAccess) {
          return res.status(403).json({
            code: "error",
            message:
              "Unauthorized access. Coach is not assigned to this class.",
          });
        }
      }

      // Query fees based on user role and permissions
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

      const fees = await query.populate("class").sort({ createdAt: "-1" });

      // Return fees data if authorized and data is found
      return res.status(200).json({
        code: "fetched",
        message: "Fees were fetched",
        data: fees,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        code: "error",
        message: "Error Occurred",
        data: err.message,
      });
    }
  },
  Editfees: async (req, res) => {
    try {
      const update = await Fees.findOneAndUpdate(
        {
          _id: req.body._id,
        },
        {
          ...req.body,
          month: new Date(req?.body?.paidOn).getMonth(),
          year: new Date(req?.body?.paidOn).getFullYear(),
        },
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
