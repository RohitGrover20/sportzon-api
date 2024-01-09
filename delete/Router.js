const {
  checkToken,
  deleteAccess,
  checkSportsArena,
  checkBanner,
  checkClasses,
  checkCoaches,
  checkClub,
  checkCourts,
  checkEvent,
  checkStudent,
  checkRole,
  checkTestimonials,
  checkUser,
} = require("../Middleware");
const {
  deleteItem,
  deleteArena,
  deleteBanner,
  deleteClasses,
  deleteCoach,
  deleteClub,
  deleteCourt,
  deleteEvent,
  deleteFees,
  deleteReports,
  deleteRole,
  deleteStudent,
  deleteTestimonial,
  deleteUser,
} = require("./Controller");

const Router = require("express").Router();

Router.get(
  "/arena/:id",
  checkToken,
  checkSportsArena,
  deleteAccess,
  deleteArena
);
Router.get("/banner/:id", checkToken, checkBanner, deleteAccess, deleteBanner);
Router.get("/class/:id", checkToken, checkClasses, deleteAccess, deleteClasses);
Router.get("/coach/:id", checkToken, checkCoaches, deleteAccess, deleteCoach);
Router.get("/club/:id", checkToken, checkClub, deleteAccess, deleteClub);
Router.get("/court/:id", checkToken, checkCourts, deleteAccess, deleteCourt);
Router.get("/event/:id", checkToken, checkEvent, deleteAccess, deleteEvent);
Router.get("/fees/:id", checkToken, checkStudent, deleteAccess, deleteFees);
Router.get(
  "/report/:id",
  checkToken,
  checkStudent,
  deleteAccess,
  deleteReports
);
Router.get("/role/:id", checkToken, checkRole, deleteAccess, deleteRole);
Router.get(
  "/student/:id",
  checkToken,
  checkStudent,
  deleteAccess,
  deleteStudent
);
Router.get(
  "/testimonial/:id",
  checkToken,
  checkTestimonials,
  deleteAccess,
  deleteTestimonial
);
Router.get("/user/:id", checkToken, checkUser, deleteAccess, deleteUser);

module.exports = Router;
