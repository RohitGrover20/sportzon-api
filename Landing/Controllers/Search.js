const Arena = require("../../arenas/Model");
const Event = require("../../events/Model");

module.exports = {
    Search: async (req, res) => {
        const keyword = req.body.keyword;
        const activity = req.body.activity;
        const state = req.body.state;
        let query;
        try {
            query = req.body.referrer == "events" ? Event : Arena;
            const Events = await query.find({
                state: { $regex: state, $options: "i" },
                slug: { $regex: keyword, $options: "i" },
                // activity: { $regex: activity, $option: "i" }

            }).sort({ "createdAt": -1 })
            if (Events) {
                return res.status(200).json({
                    code: "fetched",
                    data: Events,
                    message: "Event has been fetched"
                })
            }
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({
                code: "error",
                data: err,
                message: "We couldn't fetch the data. Please try again."
            })
        }
    }
}
