const {
  checkToken,
  checkClasses,
  writeAccess,
  readAcces,
  upadateAccess,
} = require("../Middleware");
const {
  addClasses,
  getClasses,
  getClassById,
  EditClass,
} = require("./Controller");
const Router = require("express").Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../lib/Aws-S3");
const path = require("path");

const storageS3 = multerS3({
  s3: s3,
  acl: "public-read",
  bucket: "sportzon-cdn",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) =>
    cb(null, "classes/" + Date.now() + "-" + file.originalname),
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

Router.post(
  "/edit",
  checkToken,
  checkClasses,
  upadateAccess,
  upload.single("banner"),
  EditClass
);
Router.post(
  "/",
  checkToken,
  checkClasses,
  writeAccess,
  upload.single("banner"),
  addClasses
);
Router.get("/:id", checkToken, checkClasses, readAcces, getClassById);
Router.get("/", checkToken, checkClasses, readAcces, getClasses);

module.exports = Router;
