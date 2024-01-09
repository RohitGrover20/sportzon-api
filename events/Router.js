const {
  checkToken,
  checkEvent,
  writeAccess,
  readAcces,
  upadateAccess,
} = require("../Middleware");
const { addEvent, getEvent, EditEvent } = require("./Controller");
const multer = require("multer");
const path = require("path");
const Router = require("express").Router();
const multerS3 = require("multer-s3");
const s3 = require("../lib/Aws-S3");

const storageS3 = multerS3({
  s3: s3,
  acl: "public-read",
  bucket: "sportzon-cdn",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) =>
    cb(null, "events/" + Date.now() + "-" + file.originalname),
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

Router.get("/get-events", checkToken, checkEvent, readAcces, getEvent);
Router.post(
  "/edit",
  checkToken,
  checkEvent,
  upadateAccess,
  upload.single("banner"),
  EditEvent
);
Router.post(
  "/",
  checkToken,
  checkEvent,
  writeAccess,
  upload.single("banner"),
  addEvent
);

module.exports = Router;
