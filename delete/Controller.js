const Arena = require("../arenas/Model");
const Banner = require("../banner/Model");
const Classes = require("../classes/Model");
const Club = require("../club/Model");
const Coach = require("../coaches/Model");
const Court = require("../courts/Model");
const Event = require("../events/Model");
const Fees = require("../fees/Model");
const Reports = require("../reports/Model");
const Role = require("../roles/Model");
const Student = require("../students/Model");
const Testimonial = require("../testimonials/Model");
const User = require("../users/Model");
const Affiliate = require("../affiliate/Model");
const Ticket = require("../helpDesk/Model");
const subClub = require("../subClubs/Model");
module.exports = {
  deleteArena: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await Arena.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },
  deleteBanner: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await Banner.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },
  deleteClasses: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await Classes.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },
  deleteCoach: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await Coach.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },
  deleteClub: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await Club.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },
  deleteSubClub: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await subClub.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },

  deleteCourt: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await Court.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await Event.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },

  deleteFees: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await Fees.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },

  deleteReports: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await Reports.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },

  deleteRole: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await Role.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },

  deleteStudent: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await Student.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },

  deleteTestimonial: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await Testimonial.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },

  deleteAffiliate: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await Affiliate.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await User.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },
  deleteTicket: async (req, res) => {
    try {
      const _id = req.params.id;
      const deleteItem = await Ticket.findOneAndDelete({ _id: _id });
      if (deleteItem) {
        return res.status(200).json({
          code: "deleted",
          message: "Item were deleted successfully",
          data: 0,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },
};
