const {
    checkToken,
    checkAffiliate,
    writeAccess,
    readAcces,
    upadateAccess,
  } = require("../Middleware");
  const { addAffiliate , getAffiliate } = require("./Controller");
  const Router = require("express").Router();

  Router.post("/", checkToken, checkAffiliate, writeAccess, addAffiliate);
  Router.get("/", checkToken, checkAffiliate, readAcces, getAffiliate);
  module.exports = Router;
  