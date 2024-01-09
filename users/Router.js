const {
  checkToken,
  checkUser,
  writeAccess,
  readAcces,
  checkCoaches,
  upadateAccess,
} = require("../Middleware");
const {
  addUser,
  login,
  getUser,
  getCoachUsers,
  EditUser,
  forgetPassword,
  verifyOtp,
  resetPassword,
} = require("./Controller");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../lib/Aws-S3");
const path = require("path");

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

Router.post("/login", login);
Router.post("/forget-password", forgetPassword);
Router.post("/verify-otp", verifyOtp);
Router.post("/reset-password", resetPassword);

Router.get("/coaches", checkToken, checkCoaches, readAcces, getCoachUsers);
Router.get("/", checkToken, checkUser, readAcces, getUser);
Router.post(
  "/edit",
  checkToken,
  checkUser,
  upadateAccess,
  upload.single("profile"),
  EditUser
);
Router.post(
  "/",
  checkToken,
  checkUser,
  writeAccess,
  upload.single("profile"),
  addUser
);
module.exports = Router;
