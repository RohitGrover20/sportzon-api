const Arena = require("./Model")
const fs = require('fs');

module.exports = {
    addArena: async (req, res) => {
        try {
            const isArena = await Arena.exists({ slug: req.body.slug, club: req.body.club })
            if (isArena) {
                req.files && req.files.map((item, index) => {
                    fs.unlink(item.path, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Delete File successfully.");
                    });
                })

                return res.status(200).json({
                    data: 0,
                    message: "Arena is already exists",
                    code: "duplicate"
                })
            }
            else {
                const gallery = req.files && req.files.map(item => item.filename)
                const addArena = await Arena.create({
                    ...req.body, gallery: gallery
                })
                if (addArena) {
                    return res.status(200).json({
                        data: addArena,
                        message: "Arena has been added successfully",
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

    getArena: async (req, res) => {
        try {
            const arena = await Arena.find({ club: req.user.club }).populate("club").sort({ "createdAt": -1 });
            if (arena) {
                return res.status(200).json({
                    data: arena,
                    message: "Arena has been fetched",
                    code: "fetched"
                })
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

    getArenaBySlugOrId: async (req, res) => {
        try {
            const arena = await Arena.findOne({ $or: [{ slug: req.body.slug, club: req.user.club }, { _id: req.body.id, club: req.user.club }] });
            if (arena) {
                return res.status(200).json({
                    data: arena,
                    message: "Arena has been fetched",
                    code: "fetched"
                })
            }
        }
        catch (error) {
            return res.status(200).json({
                data: error,
                message: "Something went wrong",
                code: "error"
            })
        }
    }
}