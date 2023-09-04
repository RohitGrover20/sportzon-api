const Club = require("./Model");
const fs = require("fs");

module.exports = {
  addClub: async (req, res) => {
    try {
      const isClub = await Club.exists({
        $or: [
          { slug: req.body.slug },
          { email: req.body.email },
          { contact: req.body.contact },
        ],
      });
      if (isClub) {
        res.status(200).json({
          data: 0,
          message: "Club is already exists",
          code: "duplicate",
        });
      } else {
        const logo = req.file && req.file.location;
        const addClub = await Club.create({
          ...req.body,
          logo: logo,
        });
        if (addClub) {
          res.status(200).json({
            data: addClub,
            message: "Club were added successfully",
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

  getClub: async (req, res) => {
    try {
      const club = await Club.find({}).sort({ createdAt: -1 });
      return res.status(200).json({
        data: club,
        message: "Club were fetched",
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
