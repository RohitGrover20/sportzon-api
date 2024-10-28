const {
    checkToken,
    writeAccess,
    readAcces,
    checkMerchandise,
    upadateAccess,
  } = require("../Middleware");
  const multer = require("multer");
  const path = require("path");
  const multerS3 = require("multer-s3");
  const s3 = require("../lib/Aws-S3");
  
  const {
    getMerchandise,
    addMerchandise,
    editMerchandise,
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
      cb(null, "merchandise/" + Date.now() + "-" + file.originalname),
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
    checkMerchandise,
    upadateAccess,
    upload.any("gallery", 5),
    editMerchandise
  );

  Router.post(
    "/",
    checkToken,
    checkMerchandise,
    writeAccess,
    upload.any("gallery", 5),
    addMerchandise
  );
  
  Router.get("/", checkToken, checkMerchandise, readAcces, getMerchandise);
  module.exports = Router;
  