const Event = require("./Model")

module.exports = {
    addEvent: async (req, res) => {
        try {
            const isEvent = await Event.exists({ slug: req.body.slug, club: req.body.club })
            if (isEvent) {
                // req.files && req.files.map((item, index) => {
                //     fs.unlink(path, (err) => {
                //         if (err) {
                //             throw err;
                //         }
                //         console.log("Delete File successfully.");
                //     });
                // })

                return res.status(200).json({
                    data: 0,
                    message: "Event is already exists",
                    code: "duplicate"
                })
            }
            else {
                // const gallery = req.files && req.files.map(item => item.filename)
                const banner = req.file && req.file.filename;
                const addEvent = await Event.create({ ...req.body, banner: banner, club: req.user.club, status: "active" })
                if (addEvent) {
                    return res.status(200).json({
                        data: addEvent,
                        message: "Event has been added successfully",
                        code: "created"
                    })
                }
            }
        }
        catch (err) {
            return res.status(400).json({
                data: err,
                message: "Error occured",
                code: "error"
            })
        }
    },

    getEvent: async (req, res) => {
        try {
            const event = await Event.find({ club: req.user.club }).sort({ "createdAt": -1 });
            return res.status(200).json({
                data: event,
                message: "Event has been fetched",
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