const Arena = require("../../arenas/Model");
const Event = require("../../events/Model");

module.exports = {
  Search: async (req, res) => {
    console.log(req.body);
    let search;
    try {
      if (req.body.referrer == "events") {
        search = await Event.find({
          slug:
            req.body.keyword == "" || req.body.keyword == null
              ? undefined
              : { $regex: req.body.keyword, $options: "i" },
          activity: req.body.activity == "" ? undefined : req.body.activity,
          state: req.body.state == "" ? undefined : req.body.state,
        });
      } else if (req.body.referrer == "venues") {
        search = await Arena.find({
          slug:
            req.body.keyword == "" || req.body.keyword == null
              ? undefined
              : { $regex: req.body.keyword, $options: "i" },
          state: req.body.state == "" ? undefined : req.body.state,
          activities: {
            $elemMatch: {
              value: req.body.activity == "" ? undefined : req.body.activity,
            },
          },
        });
      } else {
        search = await Arena.find({
          state: req.body.state == "" ? undefined : req.body.state,
          city: req.body.city == "" ? undefined : req.body.city,
          activities: {
            $elemMatch: {
              value: req.body.activity == "" ? undefined : req.body.activity,
            },
          },
        });
      }
      if (search) {
        return res.status(200).json({
          code: "fetched",
          data: search,
          message: "Data were fetched",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        data: err,
        message: "something went wrong. Please try again.",
      });
    }
  },
};
