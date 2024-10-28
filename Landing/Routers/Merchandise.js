const { getMerchandise, getMerchandiseBySlug } = require("../Controllers/Merchandise");

const Router = require("express").Router();
Router.get("/:slug", getMerchandiseBySlug);
Router.get("/", getMerchandise);
module.exports = Router;