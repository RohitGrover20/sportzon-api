const Court = require("./Model")

module.exports = {
    addCourt: async (req, res) => {
        try {
            const isCourt = await Court.exists({ slug: req.body.slug, club: req.body.club, arena: req.body.arena })
            if (isCourt) {
                return res.status(200).json({
                    data: 0,
                    message: "Court is already exists",
                    code: "duplicate"
                })
            }
            else {
                const addCourt = await Court.create({
                    ...req.body,
                    club: req.user.club
                })
                if (addCourt) {
                    return res.status(200).json({
                        data: addCourt,
                        message: "Court has been added successfully",
                        code: "created"
                    })
                }
            }
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({
                data: err,
                message: "Error occured",
                code: "error"
            })
        }
    },

    getCourtinArena: async (req, res) => {
        try {
            const court = await Court.find({ club: req.user.club, arena: req.body.arena }).populate(["arena", "club"]).sort({ "createdAt": -1 });
            return res.status(200).json({
                data: court,
                message: "Court has been fetched",
                code: "fetched"
            })
        }
        catch (err) {
            return res.status(400).json({
                data: err,
                message: "Error occured",
                code: "error"
            })
        }
    }

}