const {
  checkToken,
  checkStudent,
  writeAccess,
  readAcces,
  upadateAccess,
} = require("../Middleware");
const {
  getStudentsInAClass,
  BulkUploadStudents,
  AddStudent,
  EditStudent,
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
    cb(null, "students/" + Date.now() + "-" + file.originalname),
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


Router.post("/add", checkToken, checkStudent, writeAccess, AddStudent);
Router.post("/bulk-upload", checkToken, checkStudent, writeAccess, upload.single("file"),BulkUploadStudents); // Add route for bulk upload
Router.post("/edit", checkToken, checkStudent, upadateAccess, EditStudent);
Router.get(
  "/:classes",
  checkToken,
  checkStudent,
  readAcces,
  getStudentsInAClass
);
module.exports = Router;
