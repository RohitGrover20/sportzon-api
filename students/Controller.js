const Student = require("./Model");
const Court = require("./Model");

module.exports = {
  AddStudent: async (req, res) => {
    try {
    } catch (err) {}
  },

  getStudentsInAClass: async (req, res) => {
    try {
      const students = await Student.find({
        // club: req.user.club,
        admissionIn: req.params?.classes,
      }).sort({ created: "-1" });

      if (students) {
        return res.status(200).json({
          code: "fetched",
          message: "Students were fetched",
          data: students,
        });
      }
    } catch (err) {
      return res.status(200).json({
        code: "error",
        message: "Error Occured",
        data: err,
      });
    }
  },
};
