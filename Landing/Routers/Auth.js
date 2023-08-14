const { checkSession, checkToken, checkStudent } = require("../../Middleware");
const { Login, Register, profileUpdate, ProfileImageUpdate } = require("../Controllers/Auth");
const multer = require("multer");
const path = require("path");
const Router = require("express").Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, `./public/user/profile`),
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

Router.post("/login", Login);
Router.post("/register", Register);
Router.post("/profile-update", checkSession, profileUpdate);
Router.post("/mob/profile-update", checkToken, checkStudent, profileUpdate);
Router.post("/profile-image-update", checkSession, upload.single("image"), ProfileImageUpdate);

module.exports = Router;