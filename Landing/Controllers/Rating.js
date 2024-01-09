const Arena = require("../../arenas/Model");
const Classes = require("../../classes/Model");
const Rating = require("../Models/Rating");

module.exports = {
  AddRating: async (req, res) => {
    try {
      let isExists;
      if (req.body.type === "Arena") {
        isExists = await Rating.exists({
          user: req.user._id,
          type: req.body.type,
          arena: req.body.arena,
        });
      } else {
        isExists = await Rating.exists({
          user: req.user._id,
          type: req.body.type,
          class: req.body.class,
        });
      }

      if (isExists) {
        return res.status(200).json({
          code: "duplicate",
          message: "You already reviewed before.",
          data: 0,
        });
      } else {
        const rating = await Rating.create({
          ...req.body,
          user: req.user._id,
        });
        if (rating) {
          try {
            let query;
            if (rating.type == "Arena") {
              query = await Rating.find(
                { arena: rating?.arena },
                { rating: 1 }
              );
              if (query) {
                var sum = query.reduce(function (acc, obj) {
                  return acc + obj.rating;
                }, 0);
                const average = sum / query.length;
                const update = await Arena.findOneAndUpdate(
                  { _id: rating?.arena },
                  { rating: average }
                );
                if (update) {
                  return res.status(200).json({
                    code: "created",
                    message: "Thank You for your valuable feedback.",
                    data: update,
                  });
                }
              }
            } else {
              query = await Rating.find(
                { class: rating?.class },
                { rating: 1 }
              );
              if (query) {
                var sum = query.reduce(function (acc, obj) {
                  return acc + obj.rating;
                }, 0);
                const average = sum / query.length;
                const update = await Classes.findOneAndUpdate(
                  { _id: rating?.class },
                  { rating: average }
                );
                if (update) {
                  return res.status(200).json({
                    code: "created",
                    message: "Thank You for your valuable feedback.",
                    data: update,
                  });
                }
              }
            }
          } catch (err) {
            console.log(err);
            return res.status(400).json({
              code: "error",
              message: "Something went wrong. Please try again.",
              data: err,
            });
          }
        }
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
