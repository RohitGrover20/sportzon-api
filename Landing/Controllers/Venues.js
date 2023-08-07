const Arena = require("../../arenas/Model");
const Event = require("../../events/Model");

module.exports = {
    getVenues: async (req, res) => {
        try {
            const venues = await Arena.find().sort({ "createdAt": -1 });
            if (venues) {
                return res.status(200).json({
                    code: "fetched",
                    message: "Venues has been fetched",
                    data: venues
                })
            }
        }
        catch (err) {
            return res.status(400).json({
                code: "error",
                message: "Something went wrong. Please try again",
                data: err
            })
        }
    },
    getVenueBySlug: async (req, res) => {
        try {
            const venues = await Arena.findOne({ slug: req.params.slug }).sort({ "createdAt": -1 });
            if (venues) {
                return res.status(200).json({
                    code: "fetched",
                    message: "Venues has been fetched",
                    data: venues
                })
            }
        }
        catch (err) {
            return res.status(400).json({
                code: "error",
                message: "Something went wrong. Please try again",
                data: err
            })
        }
    },

}