const Router = require("express").Router();
const { Testimonials } = require("../Controllers/Testimonials");
Router.get("/", Testimonials);
module.exports = Router;
