const Reports = require("./Model");
var AWS = require("aws-sdk");

module.exports = {
  addReport: async (req, res) => {
    try {
      const IsExists = await Reports.exists({
        class: req.body.class,
        student: req.body.class,
        month: req.body.month,
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

  getReportOfStudent: async (req, res) => {
    try {
      const reports = await Reports.find({
        club: req.user.club,
        student: req.params.student,
        class: req.params.class,
      });

      if (reports) {
        return res.status(200).json({
          code: "fetched",
          message: "Reports were fetched",
          data: reports,
        });
      }
    } catch (err) {
      return res.status(200).json({
        code: "error",
        message: "Something went wrong",
        data: err,
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
