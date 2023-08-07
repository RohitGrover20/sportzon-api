const Classes = require("./Model")

module.exports = {
    addClasses: async (req, res) => {
        try {
            const isClasses = await Classes.exists({ slug: req.body.slug, fees: req.body.fees, club: req.user.club });
            if (isClasses) {
                return res.status(200).json({
                    data: 0,
                    message: "Court is already exists",
                    code: "duplicate"
                })
            }
            else {
                const addClasses = await Classes.create({
                    ...req.body,
                    club: req.user.club
                })
                if (addClasses) {
                    return res.status(200).json({
                        data: addClasses,
                        message: "Classes has been added successfully",
                        code: "created"
                    })
                }
            }
        }
        catch (err) {

        }
    },

    getClasses: async (req, res) => {
        try {
            const classes = await Classes.find({ club: req.user.club }).populate(["coach"]).sort({ "createdAt": -1 });
            return res.status(200).json({
                data: classes,
                message: "Classes has been fetched",
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