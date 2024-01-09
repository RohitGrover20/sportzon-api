const Event = require("./Model");

module.exports = {
  addEvent: async (req, res) => {
    try {
      const isEvent = await Event.exists({
        slug: req.body.slug,
        club: req.body.club,
      });
      if (isEvent) {
        return res.status(200).json({
          data: 0,
          message: "Event is already exists",
          code: "duplicate",
        });
      } else {
        const banner = req.file && req.file.location;
        const addEvent = await Event.create({
          ...req.body,
          banner: banner,
          club: req.user.club,
          status: "active",
        });
        if (addEvent) {
          return res.status(200).json({
            data: addEvent,
            message: "Event were added successfully",
            code: "created",
          });
        }
      }
    } catch (err) {
      return res.status(400).json({
        data: err,
        message: "Error occured",
        code: "error",
      });
    }
  },

  getEvent: async (req, res) => {
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Event.find({});
      } else {
        query = Event.find({ club: req.user.club });
      }
      const event = await query.sort({
        createdAt: -1,
      });
      return res.status(200).json({
        data: event,
        message: "Event were fetched",
        code: "fetched",
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        data: err,
        message: "Error occured",
        code: "error",
      });
    }
  },

  EditEvent: async (req, res) => {
    try {
      const banner = req.file && req.file.location;
      const update = await Event.findOneAndUpdate(
        {
          _id: req.body._id,
        },
        { ...req.body, banner: banner },
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
