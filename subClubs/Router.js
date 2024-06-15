const {
    checkToken,
    checkSubClub,
    writeAccess,
    readAcces,
    upadateAccess,
  } = require("../Middleware");
  const {
    addSubClub,
    getSubClubInClub,
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
      cb(null, "subclub/" + Date.now() + "-" + file.originalname),
  });
  
  const fileFilter = (req, file, callback) => {
    var ext = path.extname(file.originalname);
    // if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
    //   return callback(new Error("Only Files are allowed"));
    // }
    callback(null, true);
  };
  
  const upload = multer({
    storage: storageS3,
    fileFilter: fileFilter,
  });
  
  Router.post(
    "/",
    checkToken,
    checkSubClub,
    writeAccess,
    upload.single("logo"),
    addSubClub
  );
  Router.get(
    "/:club",
    checkToken,
    checkSubClub,
    readAcces,
    getSubClubInClub
  );
  module.exports = Router;
  