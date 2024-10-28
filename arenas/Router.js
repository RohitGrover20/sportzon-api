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

// Configure multer storage for S3
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

// File filter for images and PDFs
const fileFilter = (req, file, callback) => {
  const imageTypes = /jpeg|jpg|png|gif/;
  const pdfType = /pdf/;

  const isImage =
    imageTypes.test(path.extname(file.originalname).toLowerCase()) &&
    imageTypes.test(file.mimetype.toLowerCase());
  const isPdf =
    pdfType.test(path.extname(file.originalname).toLowerCase()) &&
    pdfType.test(file.mimetype.toLowerCase());

  if (file.fieldname === "gallery" && !isImage) {
    return callback(
      new Error("Only images are allowed for the gallery"),
      false
    );
  }

  if (file.fieldname === "agreement" && !isPdf) {
    return callback(
      new Error("Only PDF files are allowed for the agreement"),
      false
    );
  }

  callback(null, true);
};

// Configure multer
const upload = multer({
  storage: storageS3,
  fileFilter: fileFilter,
});

// Define routes
Router.post(
  "/get-arena-by-slug-or-id",
  checkToken,
  checkSportsArena,
  readAcces,
  getArenaBySlugOrId
);

Router.post(
  "/edit",
  checkToken,
  checkSportsArena,
  upadateAccess,
  upload.fields([
    { name: "gallery[0]", maxCount: 1 },
    { name: "gallery[1]", maxCount: 1 },
    { name: "gallery[2]", maxCount: 1 },
    { name: "gallery[3]", maxCount: 1 },
    { name: "gallery[4]", maxCount: 1 },
    { name: "agreement", maxCount: 1 },
  ]),
  EditArena
);

Router.post(
  "/",
  checkToken,
  checkSportsArena,
  writeAccess,
  upload.fields([
    { name: "gallery[0]", maxCount: 1 },
    { name: "gallery[1]", maxCount: 1 },
    { name: "gallery[2]", maxCount: 1 },
    { name: "gallery[3]", maxCount: 1 },
    { name: "gallery[4]", maxCount: 1 },
    { name: "agreement", maxCount: 1 },
  ]),
  addArena
);

Router.get("/", checkToken, checkSportsArena, readAcces, getArena);

module.exports = Router;
