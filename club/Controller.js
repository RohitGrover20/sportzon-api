const Club = require("./Model");
const fs = require("fs");

module.exports = {
  addClub: async (req, res) => {
    try {
      const isClub = await Club.exists({
        $or: [{ slug: req.body.slug }, { email: req.body.email }],
      });
      if (isClub) {
        res.status(200).json({
          data: 0,
          message: "Club is already exists",
          code: "duplicate",
        });
      } else {
        const logo = req.body.logo;
        let docType;
        let application;
        const typeDecision = logo.split(";")[0].split("/")[1];
        if (typeDecision == "png") {
          docType = "png";
          application = "data:image/png;base64";
        } else {
          docType = "jpg";
          application = "data:image/jpeg;base64";
        }
        const buf = Buffer.from(logo.replace(application, ""), "base64");
        fs.writeFile(
          `./public/club-logo/${req.body.title
            .replace(/[&\/\\#,+_!^()$~%.'":*?<>{}\s]/g, "-")
            .toLowerCase()}.${docType}`,
          buf,
          async (err, result) => {
            if (err) {
              return res.status(400).json({
                code: "fileerror",
                message: "Something went wrong with logo file",
                data: err,
              });
            } else {
              const addClub = await Club.create({
                ...req.body,
                logo:
                  req.body.title
                    .replace(/[&\/\\#,+_!^()$~%.'":*?<>{}\s]/g, "-")
                    .toLowerCase() +
                  "." +
                  docType,
              });
              if (addClub) {
                res.status(200).json({
                  data: addClub,
                  message: "Club has been added successfully",
                  code: "created",
                });
              }
            }
          }
        );
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({
        data: err,
        message: "Error occured",
        code: "error",
      });
    }
  },
  getClub: async (req, res) => {
    try {
      const club = await Club.find({}).sort({ createdAt: -1 });
      return res.status(200).json({
        data: club,
        message: "Club has been fetched",
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
