const { checkToken, checkSportsArena, writeAccess, readAcces } = require("../Middleware");
const multer = require("multer");
const path = require("path");


const { addArena, getArena, getArenaBySlugOrId } = require("./Controller");
const Router = require("express").Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, `./public/venue`),
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



Router.post("/", checkToken, checkSportsArena, writeAccess, upload.any('gallery', 3), addArena);
Router.post("/get-arena-by-slug-or-id", checkToken, checkSportsArena, readAcces, getArenaBySlugOrId);
Router.get("/", checkToken, checkSportsArena, readAcces, getArena);
module.exports = Router