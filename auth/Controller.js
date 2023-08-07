const { verify } = require("jsonwebtoken");
const Role = require("../roles/Model");
const passport = require("passport");
module.exports = {
    verify: async (req, res) => {
        const token = req.body.token;
        if (token) {
            verify(token, process.env.TOKEN_KEY, (err, payload) => {
                if (err) {
                    return res.status(401).json({
                        data: err,
                        message: "Token expired or Invalid token",
                        code: "unauthorised",
                    })
                } else {
                    Role.findOne({ _id: payload.isUser && payload.isUser.role }).then((result) => {
                        const permissions = result && result.permissions;
                        const roleTitle = result && result.title;
                        return res.status(200).json({
                            data: payload && { ...payload.isUser, permissions: permissions, roleTitle: roleTitle },
                            message: "User has been verified",
                            code: "authorised",
                            verified: true,
                            token: token
                        })
                    }).catch((error) => {
                        return res.status(401).json({
                            data: error,
                            message: "Couldn't fetch permission",
                            code: "permissionerror"
                        })
                    })
                }
            })
        }
    },

    verfiySession: (req, res) => {
        if (!req.session || !req.user) {
            return res.status(401).json({
                data: 0,
                message: "Session not started",
                code: "unauthorised"
            })
        } else {
            const user = req.user;
            Role.findOne({ _id: user && user.role }).then((result) => {
                const permissions = result && result.permissions;
                return res.status(200).json({
                    data: { ...req.user, permissions: permissions },
                    message: "User has been verified",
                    code: "authorised"
                })
            }).catch((error) => {
                return res.status(401).json({
                    data: error,
                    message: "Couldn't fetch permission",
                    code: "permissionerror"
                })
            })
        }
    }
}