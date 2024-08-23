const {
    checkToken,
    checkRole,
    writeAccess,
    readAcces,
    upadateAccess,
  } = require("../Middleware");
const Router = require("express").Router();
const { createSubscription, getAllSubscriptions , updateSubscription } = require('./Controller');
Router.post('/', checkToken , checkRole, writeAccess , createSubscription);
Router.get('/', checkToken , checkRole, readAcces, getAllSubscriptions);
Router.put('/:id', checkToken, checkRole, upadateAccess, updateSubscription);

module.exports = Router;
