const { checkToken, checkEvent, writeAccess, readAcces } = require("../Middleware");
const { addEvent, getEvent } = require("./Controller");
const multer = require("multer");
const path = require("path");
const Router = require("express").Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, `./public/events`),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});


const fileFilter = (req, file, callback) => {
    var ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

Router.get("/", checkToken, checkEvent, readAcces, getEvent);
Router.post("/", checkToken, checkEvent, writeAccess, upload.single("banner"), addEvent);

module.exports = Router;