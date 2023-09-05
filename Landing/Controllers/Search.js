const Arena = require("../../arenas/Model");
const Event = require("../../events/Model");

module.exports = {
  Search: async (req, res) => {
    let search;
    try {
      if (req.body.referrer == "events") {
        search = await Event.find({
          slug:
            req.body.keyword == ""
              ? undefined
              : { $regex: req.body.keyword, $options: "i" },
          activity: req.body.activity == "" ? undefined : req.body.activity,
          state: req.body.state == "" ? undefined : req.body.state,
        });
      } else if (req.body.referrer == "venues") {
        search = await Arena.find({
          slug:
            req.body.keyword == ""
              ? undefined
              : { $regex: req.body.keyword, $options: "i" },
          state: req.body.state == "" ? undefined : req.body.state,
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
          message: "Event were fetched",
        });
      }
    } catch (err) {
      return res.status(400).json({
        code: "fetched",
        data: err,
        message: "Event were fetched",
      });
    }
  },
};
