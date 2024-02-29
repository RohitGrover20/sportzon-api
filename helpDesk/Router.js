const {
    checkToken,
    checkTicket,
    writeAccess,
    readAcces,
    upadateAccess,
  } = require("../Middleware");
  const { addTicket, getTickets , EditTickets } = require("./Controller");
  
  const Router = require("express").Router();
  
  Router.post("/edit", checkToken, checkTicket, upadateAccess, EditTickets);
  Router.post("/", checkToken, checkTicket, writeAccess, addTicket);
  Router.get("/", checkToken, checkTicket, readAcces, getTickets);
  
  module.exports = Router;
  