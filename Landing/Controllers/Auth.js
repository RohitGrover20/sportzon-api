const { hash } = require("bcrypt");
require('dotenv').config();
const bcrypt = require("bcrypt");
const User = require("../../users/Model");


module.exports = {
    Register: async (req, res) => {
        try {
            const isRegistered = await User.exists({ $or: [{ email: req.body.email }, { mobile: req.body.mobile }] });
            if (isRegistered) {
                return res.status(200).json({
                    data: 0,
                    message: "User is already exists",
                    code: "duplicate"
                })
            }
            else {
                hash(req.body.password, 10, async (err, hash) => {
                    if (hash) {
                        if (hash) {
                            const addUser = await User.create({
                                ...req.body,
                                role: "64ba1e1408376a6fd50c50f2",
                                club: "64a7c238ce825993da286481",
                                password: hash
                            })
                            if (addUser) {
                                return res.status(200).json({
                                    data: addUser,
                                    message: "Thankyou for signing up",
                                    code: "created"
                                });
                            }
                        }
                    }
                })

            }
        }
        catch (err) {
            return res.status(400).json({
                data: err,
                message: "Couldn't proceed. Try again later",
                code: "error"
            })
        }
    },
    Login: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(401).json({
                    data: 0,
                    message: "User with this email does not exists",
                    code: "unauthorised"
                })
            }
            else {
                const userPass = user.password;
                const matchPassword = await bcrypt.compare(req.body.password, userPass);
                if (matchPassword) {
                    user.password = undefined;
                    return res.status(200).json({
                        data: {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            mobile: user.mobile,
                            role: user.role,
                            club: user.club
                        },
                        message: "Logged in sucessfully",
                        code: "authorised",
                        verified: true
                    })
                }
                else {
                    return res.status(401).json({
                        data: 0,
                        message: "You have entered a wrong password. Please try again",
                        code: "unauthorised"
                    })
                }
            }
        }
        catch (err) {
            console.log(err)
            return res.status(401).json({
                data: err,
                message: "Error Occured",
                code: "error"
            })
        }
    },

    profileUpdate: async (req, res) => {
        try {
            const update = await User.findOneAndUpdate({ _id: req.user._id }, req.body);
            if (update) {
                return res.status(200).json({
                    data: update,
                    code: "updated",
                    message: "Updated. Please login again!"
                })
            }
        }
        catch (err) {
            console.log(err)
            return res.status(200).json({
                data: err,
                code: "error",
                message: "Something went wrong. Please try again"
            })
        }
    },
}