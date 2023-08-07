const { checkSession } = require("../../Middleware");
const { Login, Register, profileUpdate } = require("../Controllers/Auth");

const Router = require("express").Router();
Router.post("/login", Login);
Router.post("/register", Register);
Router.post("/profile-update", checkSession, profileUpdate);

module.exports = Router;