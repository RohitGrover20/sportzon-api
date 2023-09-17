const {
  checkToken,
  checkSportsArena,
  writeAccess,
  readAcces,
  upadateAccess,
} = require("../Middleware");
const multer = require("multer");
const path = require("path");
const multerS3 = require("multer-s3");
const s3 = require("../lib/Aws-S3");

const {
  addArena,
  getArena,
  getArenaBySlugOrId,
  EditArena,
} = require("./Controller");
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
    cb(null, "venues/" + Date.now() + "-" + file.originalname),
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
  checkSportsArena,
  upadateAccess,
  upload.any("gallery", 3),
  EditArena
);
Router.post(
  "/",
  checkToken,
  checkSportsArena,
  writeAccess,
  upload.any("gallery", 3),
  addArena
);
Router.post(
  "/get-arena-by-slug-or-id",
  checkToken,
  checkSportsArena,
  readAcces,
  getArenaBySlugOrId
);
Router.get("/", checkToken, checkSportsArena, readAcces, getArena);
module.exports = Router;
