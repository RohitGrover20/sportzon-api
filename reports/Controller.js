const Classes = require("../classes/Model");
const Coach = require("../coaches/Model");
const Role = require("../roles/Model");
const Reports = require("./Model");
var AWS = require("aws-sdk");

module.exports = {
  addReport: async (req, res) => {
    const banner = req.file && req.file.location;
    try {
      const IsExists = await Reports.exists({
        class: req.body.class,
        student: req.body.class,
        month: req.body.month,
        banner: banner,
      });
      if (IsExists) {
        return res.status(200).json({
          message: "Already exists",
          code: "duplicate",
          data: 0,
        });
      } else {
        const report = await Reports.create({
          ...req.body,
          club: req.user.club,
          banner: banner,
        });
        if (report) {
          return res.status(200).json({
            code: "created",
            message: "Report were created successfully.",
            data: report,
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        message: "Something went wrong. Please try again.",
        code: "error",
        data: err,
      });
    }
  },

  // getReportOfStudent: async (req, res) => {
  //   try {
  //     let query;
  //     if (
  //       process.env.SUPERADMINROLE == req.user.role &&
  //       process.env.SUPERADMINCLUB == req.user.club
  //     ) {
  //       query = Reports.find({
  //         student: req.params.student,
  //         class: req.params.class,
  //       });
  //     } else {
  //       query = Reports.find({
  //         club: req.user.club,
  //         student: req.params.student,
  //         class: req.params.class,
  //       });
  //     }

  //     const reports = await query
  //       .populate(["class", "student"])
  //       .sort({ createdAt: -1 });

  //     if (reports) {
  //       return res.status(200).json({
  //         code: "fetched",
  //         message: "Reports were fetched",
  //         data: reports,
  //       });
  //     }
  //   } catch (err) {
  //     return res.status(200).json({
  //       code: "error",
  //       message: "Something went wrong",
  //       data: err,
  //     });
  //   }
  // },


   getReportOfStudent : async (req, res) => {
    try {
      // Fetch user role and coach details based on the logged-in user
      const userRole = await Role.findById(req.user.role);
      const coachDetails = await Coach.findOne({ user: req.user._id });
  
      let query;
  
      // If user is a coach, check if they are assigned to the class
      if (userRole?.title === "Coach") {
        const classes = await Classes.find().sort({ createdAt: -1 }).exec();
  
        // Filter classes to find if coach has access to the requested class
        const filteredClasses = classes.filter(cls =>
          cls.coaches.some(coach => coach.value.toString() === coachDetails._id.toString())
        );
  
        // Check if coach has access to the requested class
        const hasAccess = filteredClasses.some(cls => cls._id.toString() === req.params.class);
        if (!hasAccess) {
          return res.status(403).json({
            code: 'error',
            message: 'Unauthorized access',
          });
        }
        else {
          query = Reports.find({
            club: req.user.club,
            student: req.params.student,
            class: req.params.class,
          });
        }
      }
  
      // Query reports based on user role and permissions
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Reports.find({
          student: req.params.student,
          class: req.params.class,
        });
      } else {
        query = Reports.find({
          club: req.user.club,
          student: req.params.student,
          class: req.params.class,
        });
      }
  
      const reports = await query.populate(["class", "student"]).sort({ createdAt: -1 });
  
      // Return reports data if authorized and data is found
      return res.status(200).json({
        code: "fetched",
        message: "Reports were fetched",
        data: reports,
      });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        code: "error",
        message: "Something went wrong",
        data: err.message,
      });
    }
  },

  uploadReport: (req, res) => {
    var s3 = new AWS.S3();
    const file = req.body.file;
    docType = "pdf";
    application = "data:application/pdf;filename=generated.pdf;base64,";
    const buf = Buffer.from(file.replace(application, ""), "base64");
    s3.upload(
      {
        Bucket: "sportzon-cdn",
        Key: `Reports/${req.body.class}/${req.body.student}/${req.body.report}-${req.body.month}.pdf`,
        Body: buf,
        ACL: "public-read",
        ContentDisposition: "inline",
        ContentType: "application/pdf",
      },

      async function (putErr, putData) {
        if (putErr) {
          return res.status(400).json({
            code: "error",
            data: putErr,
            message: "Something went wrong",
          });
        } else {
          try {
            const report = await Reports.findOneAndUpdate(
              {
                class: req.body.class,
                student: req.body.student,
                _id: req.body.report,
              },
              { reportPdf: putData?.Location }
            );
            if (report) {
              return res.status(200).json({
                code: "uploaded",
                data: report,
                message: "Report were uploaded successfully.",
              });
            }
          } catch (err) {
            return res.status(400).json({
              code: "error",
              data: err,
              message: "Something went wrong",
            });
          }
        }
      }
    );
  },
};
