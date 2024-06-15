const subClub = require("./Model");
const fs = require("fs");

module.exports = {
  addSubClub: async (req, res) => {
    try {
      const isSubClub = await subClub.exists({
        $or: [
          { slug: req?.body?.slug },
          { email: req?.body?.email },
          { contact: req?.body?.contact },
        ],
      });
      if (isSubClub) {
        res.status(200).json({
          data: 0,
          message: "subClub is already exists",
          code: "duplicate",
        });
      } else {
        const logo = req.file && req.file.location;
        const addSubClub = await subClub.create({
          ...req.body,
          logo: logo,
        });
        if (addSubClub) {
          res.status(200).json({
            data: addSubClub,
            message: "subClub were added successfully",
            code: "created",
          });
        }
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
  getSubClubInClub: async (req, res) => {
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = subClub.find({
          clubIn: req?.params?.club,
        });
      } else {
        query = subClub.find({
          clubIn: req.params?.club,
        });
      }

      const subclubs = await query.sort({ createdAt: "-1" });
      if (subclubs) {
        return res.status(200).json({
          code: "fetched",
          message: "SubClubs were fetched",
          data: subclubs,
        });
      }
    } catch (err) {
      return res.status(200).json({
        code: "error",
        message: "Error Occured",
        data: err,
      });
    }
  },
};
