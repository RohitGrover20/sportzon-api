const { checkSession, checkToken, checkStudent } = require("../../Middleware");
const {
  Register,
  profileUpdate,
  ProfileImageUpdate,
  passwordChange,
} = require("../Controllers/Auth");
const multer = require("multer");
const path = require("path");
const multerS3 = require("multer-s3");
const s3 = require("../../lib/Aws-S3");
const Router = require("express").Router();

const storageS3 = multerS3({
  s3: s3,
  acl: "public-read",
  bucket: "sportzon-cdn",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) =>
    cb(null, "users/" + Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, callback) => {
  var ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
    return callback(new Error("Only images are allowed"));
  }
  callback(null, true);
};

const upload = multer({
  storage: storageS3,
  fileFilter: fileFilter,
});

// Router.post("/login", Login);
Router.post("/register", Register);
Router.post("/profile-update", checkSession, profileUpdate);
Router.post("/password-change/mob", checkToken, passwordChange);
Router.post("/password-change", checkSession, passwordChange);
Router.post("/profile-update/mob", checkToken, profileUpdate);
Router.post(
  "/profile-image-update/mob",
  checkToken,
  upload.single("image"),
  ProfileImageUpdate
);
Router.post(
  "/profile-image-update",
  checkSession,
  upload.single("image"),
  ProfileImageUpdate
);

module.exports = Router;
