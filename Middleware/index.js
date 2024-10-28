const { verify } = require("jsonwebtoken");
const Role = require("../roles/Model");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

AWS.config.update({
  // accessKeyId: process.env.ACCESS_KEY_ID,
  // secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

module.exports = {
  checkToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: "Token expired or Invalid token",
            err: err,
          });
        } else {
          Role.findOne({ _id: decoded.isUser && decoded.isUser.role })
            .then((result) => {
              const permissions = result && result.permissions;
              req.user = decoded.isUser;
              req.permissions = permissions;
              next();
            })
            .catch((error) => {
              return res.status(401).json({
                data: error,
                message: "Couldn't fetch permission",
                code: "permissionerror",
              });
            });
        }
      });
    } else {
      return res.status(401).json({
        data: 0,
        message: "Unauthorised User. Please Login again",
        code: "unauthorised",
      });
    }
  },
  readAcces: (req, res, next) => {
    const access = req.access;
    if (access.includes("read")) {
      next();
    } else {
      return res.status(401).json({
        message: "You do not have read access",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  writeAccess: (req, res, next) => {
    const access = req.access;
    if (access.includes("write")) {
      next();
    } else {
      return res.status(401).json({
        message: "You do not have write access",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  upadateAccess: (req, res, next) => {
    const access = req.access;
    if (access.includes("update")) {
      next();
    } else {
      return res.status(401).json({
        message: "You do not have update access",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  deleteAccess: (req, res, next) => {
    const access = req.access;
    if (access.includes("delete")) {
      next();
    } else {
      return res.status(401).json({
        message: "You do not have update access",
        data: 0,
        code: "unauthorised",
      });
    }
  },

  checkUser: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      (permissions &&
        permissions.filter((permission) => permission.permission == "User")) ||
      [];
    if (check && check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  checkDashboard: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      (permissions &&
        permissions.filter(
          (permission) => permission.permission == "Dashboard"
        )) ||
      [];
    if (check && check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },

  checkAffiliate: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      (permissions &&
        permissions.filter(
          (permission) => permission.permission == "Affiliate"
        )) ||
      [];
    if (check && check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  checkTicket: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      (permissions &&
        permissions.filter(
          (permission) => permission.permission == "Help Desk"
        )) ||
      [];
    if (check && check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },

  checkClub: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter((permission) => permission.permission == "Club");
    if (check?.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  checkRole: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter((permission) => permission.permission == "Roles");
    if (check?.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  checkSportsArena: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter(
        (permission) => permission.permission == "Sports Arena or Venue"
      );
    if (check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },

  checkMerchandise: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter(
        (permission) => permission.permission == "Merchandise"
      );
    if (check?.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },

  checkEvent: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter((permission) => permission.permission == "Events");
    if (check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  checkCourts: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter((permission) => permission.permission == "Courts");
    if (check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  checkBooking: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter((permission) => permission.permission == "Bookings");
    if (check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  checkClasses: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter((permission) => permission.permission == "Classes");
    if (check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  checkCoaches: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter((permission) => permission.permission == "Coaches");
    if (check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  checkStudent: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter((permission) => permission.permission == "Student");
    if (check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  checkStudentFees: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter((permission) => permission.permission == "StudentFees");
    if (check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  checkStudentReport: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter((permission) => permission.permission == "StudentReport");
    if (check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  checkSubClub: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter((permission) => permission.permission == "Club");
    if (check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  checkCommunity: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter((permission) => permission.permission == "Community");
    if (check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  checkTestimonials: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter(
        (permission) => permission.permission == "Testimonials"
      );
    if (check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },
  checkBanner: (req, res, next) => {
    const permissions = req.permissions;
    const check =
      permissions &&
      permissions.filter((permission) => permission.permission == "Banners");
    if (check.length > 0) {
      const access = check && check[0].access;
      req.access = access;
      next();
    } else {
      return res.status(401).json({
        message: "You do not have permission for this task.",
        data: 0,
        code: "unauthorised",
      });
    }
  },

  // ----------------Website Authentication ----------------------

  checkSession: (req, res, next) => {
    if (!req.session || !req.user) {
      return res.status(401).json({
        data: 0,
        message: "Session not started",
        code: "unauthorised",
      });
    } else {
      const user = req.user;
      Role.findOne({ _id: user && user.role })
        .then((result) => {
          const permissions = result && result.permissions;
          req.user = user;
          req.permissions = permissions;
          next();
        })
        .catch((error) => {
          return res.status(401).json({
            data: error,
            message: "Couldn't fetch permission",
            code: "permissionerror",
          });
        });
    }
  },

  // --------------S3 Bucket---------------------------
};
