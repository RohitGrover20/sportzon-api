const Razorpay = require('razorpay');
var crypto = require("crypto");
const Payment = require('../Models/Payments');
const { Booking } = require('../../bookings/Model');
var instance = new Razorpay({ key_id: 'rzp_test_UX09CkpYTnoeB5', key_secret: 'RDFYvvs6b5ECg2Z6HYFupEgx' })
module.exports = {
    Orders: (req, res) => {
        var options = {
            amount: req.body.amount,  // amount in the smallest currency unit
            currency: "INR",
        };

        if (req.body.bookingType == "event") {
            let query = Booking.exists({ user: req.body.user, event: req.body.event });
            query.then((result) => {
                if (!result) {
                    instance.orders.create(options, function (err, order) {
                        if (err) {
                            return res.status(400).json({
                                code: "error",
                                data: err,
                                message: "Order failed. Please try again"
                            })
                        }
                        else {
                            return res.status(200).json({
                                code: "ordered",
                                data: order,
                                message: "Order placed successfully"
                            })
                        }
                    });
                }
                else {
                    return res.status(200).json({
                        code: "duplicate",
                        message: "Booking already exists",
                        data: 0
                    })
                }
            }).catch((err) => {
                return res.status(400).json({
                    code: "error",
                    data: err,
                    message: "Order failed. Please try again"
                })
            })
        }
        else {
            instance.orders.create(options, function (err, order) {
                if (err) {
                    return res.status(400).json({
                        code: "error",
                        data: err,
                        message: "Order failed. Please try again"
                    })
                }
                else {
                    return res.status(200).json({
                        code: "ordered",
                        data: order,
                        message: "Order placed successfully"
                    })
                }
            });
        }

    },


    Verify: (req, res) => {
        let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
        var expectedSignature = crypto.createHmac('sha256', instance.key_secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === req.body.response.razorpay_signature) {
            Payment.create({
                user: req.user._id,
                razorpay_order_id: req.body.response.razorpay_order_id,
                razorpay_payment_id: req.body.response.razorpay_payment_id,
                razorpay_signature: req.body.response.razorpay_signature
            }).then((result) => {
                const data = req.body.data;
                // instance.orders.fetchPayments(req.body.response.razorpay_order_id).then((result) => {
                //     res.send(result)
                // })
                Booking.create({
                    ...data,
                    user: req.user._id,
                    bookingId: "BKG" + Math.floor(Math.random() * 100) + data.bookingType && data.bookingType.toUpperCase() + new Date().getTime(),
                    orderId: req.body.response.razorpay_order_id,
                    club: req.user.club,
                    status: "upcoming"
                }).then((result) => {
                    res.status(200).json({
                        code: "booked",
                        message: 'Booking has been placed successfully',
                        data: result
                    });
                }).catch((err) => {
                    console.log(err)
                    res.status(400).json({
                        code: "error",
                        message: 'Something went wrong. Please try again',
                        data: err
                    });
                })
            }).catch((err) => {
                console.log(err)
                res.status(400).json({
                    code: "error",
                    message: 'Something went wrong. Please try again',
                    data: err
                });
            })
        } else {
            console.log(err)
            res.status(400).json({
                code: "error",
                message: 'Invalid Signature',
                data: err
            });
        }
    }
}