const Arena = require("../../arenas/Model");
const Event = require("../../events/Model");
const Class = require("../../classes/Model"); // Assuming you have a model for classes

module.exports = {
  Search: async (req, res) => {
    try {
      let searchQuery = {};

      if (req?.body?.keyword) {
        searchQuery.slug = { $regex: req.body.keyword, $options: "i" };
      }

      if (req?.body?.activity) {
        searchQuery.activities = {
          $elemMatch: {
            value: req.body.activity == "" ? undefined : req.body.activity,
          },
        };
      }

      if (req.body.city) {
        searchQuery.city = req.body.city;
      } else {
        if (req.body.state) {
          searchQuery.state = req.body.state;
        }
      }

      let search;

      if (req.body.referrer === "events") {
        search = await Event.find(searchQuery);
      } else if (req.body.referrer === "venues") {
        search = await Arena.find(searchQuery);
      } else if (req.body.referrer === "classes") {
        search = await Class.find(searchQuery);
      } else {
        // Default case (if referrer is not specified or recognized)
        search = await Arena.find(searchQuery);
      }

      return res.status(200).json({
        code: "fetched",
        data: search || [],
        message: "Data were fetched",
      });
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
