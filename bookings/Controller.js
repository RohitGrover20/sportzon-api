const { Booking } = require("./Model")

module.exports = {
    eventBooking: async (req, res) => {
        try {
            const booking = await Booking.find({ club: req.user.club, bookingType: "event" }).populate(["user", "event"]).sort({ "createdAt": "-1" });
            if (booking) {
                return res.status(200).json({
                    code: "fetched",
                    data: booking,
                    message: "Event Booking has been fetched",
                })
            }
        }
        catch (err) {
            return res.status(400).json({
                code: "error",
                data: err,
                message: "Something went wrong",
            })
        }
    },

    arenaBooking: async (req, res) => {
        try {
            const booking = await Booking.find({ club: req.user.club, bookingType: "arena" }).populate(["user", "arena", "court"]).sort({ "createdAt": "-1" });
            if (booking) {
                return res.status(200).json({
                    code: "fetched",
                    data: booking,
                    message: "Arena Booking has been fetched",
                })
            }
        }
        catch (err) {
            return res.status(400).json({
                code: "error",
                data: err,
                message: "Something went wrong",
            })
        }
    },

    addBooking: async (req, res) => {
        try {
            let query = "";
            const BookingType = req.body.bookingType;
            if (BookingType == "event") {
                query = await Booking.exists({ event: req.body.event, user: req.body.user });
            }
            else {
                query = await Booking.exists({ arena: req.body.arena, user: req.body.user });
            }

            if (query) {
                res.status(200).json({
                    data: 0,
                    message: "Booking is already exists",
                    code: "duplicate"
                })
            }
            else {
                const bookingId = `${req.body.bookingType.toUpperCase()}BKG${Date.now()}`
                const addBooking = await Booking.create({ ...req.body, bookingId: bookingId });
                if (addBooking) {
                    return res.status(200).json({
                        data: addBooking,
                        message: "Booking has been added successfully",
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
    }

}