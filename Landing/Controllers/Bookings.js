const { Booking } = require("../../bookings/Model");

module.exports = {
    myBookings: async (req, res) => {
        try {
            const booking = await Booking.find({ user: req.user._id }).populate(["arena", "court", "event"]).sort({ "createdAt": -1 });
            if (booking) {
                return res.status(200).json({
                    code: "fetched",
                    message: "You bookings has been fetched",
                    data: booking
                })
            }
        }
        catch (err) {
            return res.status(400).json({
                code: "error",
                message: "We couldn't fetched booking. Please try again",
                data: err
            })
        }
    },
}