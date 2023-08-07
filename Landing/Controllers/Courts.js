const Court = require("../../courts/Model");

module.exports = {
    getCourtByVenue: async (req, res) => {
        try {
            const courts = await Court.find({ arena: req.params.venueId }).sort({ "createdAt": -1 });
            if (courts) {
                return res.status(200).json({
                    code: "fetched",
                    message: "Courts has been fetched",
                    data: courts
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
    }
}