const Affiliate = require("./Model");
require("dotenv").config();

module.exports = {
  addAffiliate: async (req, res) => {
    try {
      const AffiliateCheck = await Affiliate.findOne({
        title: req.body.title,
        code: req.body.code,
      });
      if (!AffiliateCheck) {
        Affiliate.create({
          ...req.body,
          status: "active",
        })
          .then((result) => {
            return res.status(200).json({
              code: "created",
              data: result,
              message: "Offers were added successfully.",
            });
          })
          .catch((err) => {
            return res.status(400).json({
              code: "error",
              data: err,
              message: err,
            });
          });
      } else if (AffiliateCheck) {
        return res.status(200).json({
          code: "duplicate",
          data: 0,
          message: "Offer already exists .",
        });
      } else {
        return res.status(400).json({
          code: "error",
          data: 0,
          message: "Something went wrong. Please try again.",
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

  getAffiliate: async (req, res) => {
    let query;
    try {
      query = Affiliate.find();
      const affiliateData = await query.sort({
        createdAt: -1,
      });
      return res.status(200).json({
        data: affiliateData,
        message: "Offers were fetched",
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
