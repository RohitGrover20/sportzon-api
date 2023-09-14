const Rating = require("../Models/Rating");

module.exports = {
  AddRating: async (req, res) => {
    try {
      const isExists = await Rating.exists({
        $or: [
          { user: req.user._id, arena: req.body.arena },
          { user: req.user._id, class: req.body.class },
        ],
      });
      if (!isExists) {
        const rating = await Rating.create({
          ...req.body,
          user: req.user._id,
        });
        if (rating) {
          return res.status(200).json({
            code: "created",
            message: "Rating were added. Thanks!",
            data: rating,
          });
        }
      } else {
        return res.status(200).json({
          code: "duplicate",
          message: "You already reviewed before.",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },
  averageRating: async (req, res) => {
    try {
      let query;
      if (req.body.type == "Arena") {
        query = await Rating.find({ arena: req.body.arena }, { rating: 1 });
      } else {
        query = await Rating.find({ class: req.body.class }, { rating: 1 });
      }

      if (query) {
        var sum = query.reduce(function (acc, obj) {
          return acc + obj.rating;
        }, 0);
        const average = sum / query.length;
        return res.status(200).json({
          code: "fetched",
          data: average,
          message: "Rating were fetched.",
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
};
