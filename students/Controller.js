const Fees = require("../fees/Model");
const Student = require("./Model");
const Court = require("./Model");
const multer = require("multer");
const fs = require("fs");
const s3 = require("../lib/Aws-S3");
const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
var AWS = require("aws-sdk");
const axios = require("axios");
module.exports = {
  AddStudent: async (req, res) => {
    try {
      const isExists = await Student.exists({
        user: req.body.user,
        admissionIn: req.body.class,
        admissionNo: req.body.admissionNo,
      });
      if (isExists) {
        return res.status(200).json({
          code: "duplicate",
          data: 0,
          message: "Already Enrolled in this Class.",
        });
      } else {
        const student = await Student.create({
          ...req.body,
          admissionIn: req.body.class,
          studentId: "SPZ" + Math.floor(Math.random() * 9000) + 1000,
          lastFeesPaidOn: new Date().toISOString(),
          club: req.user.club,
        });
        if (student) {
          return res.status(200).json({
            data: student,
            message: "You were registered successfully.",
            code: "created",
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        data: err,
        message: "Error Occured",
      });
    }
  },

  getStudentsInAClass: async (req, res) => {
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Student.find({
          admissionIn: req.params?.classes,
        });
      } else {
        query = Student.find({
          club: req.user.club,
          admissionIn: req.params?.classes,
        });
      }

      const students = await query.sort({ createdAt: "-1" });
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

  EditStudent: async (req, res) => {
    try {
      const update = await Student.findOneAndUpdate(
        {
          _id: req.body._id,
        },
        req.body,
        {
          new: true,
        }
      );

      if (update) {
        return res.status(200).json({
          code: "update",
          message: "Data were updated successfully.",
          data: update,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: err,
      });
    }
  },

  BulkUploadStudents: async (req, res) => {
    const classId = req.body.class;
    const clubId = req.user.club;
    try {
      if (!req.body.students || !Array.isArray(req.body.students)) {
        return res.status(400).json({
          code: "error",
          message: "No student data found or invalid format.",
        });
      }

      const studentsData = req.body.students;
      const students = [];

      // Fetch existing students in the specified class
      const existingStudents = await Student.find({ admissionIn: classId });

      // Create a map of existing student emails, admission numbers, admission IDs, and phone numbers
      const existingEmails = {};
      const existingAdmissionNos = {};
      const existingAdmissionIds = {};
      const existingPhoneNos = {};
      existingStudents.forEach((student) => {
        existingEmails[student.email.toLowerCase()] = student.user.toString();
        existingAdmissionNos[student.admissionNo] = true;
        existingAdmissionIds[student.admissionId] = true;
        existingPhoneNos[student.phoneNo] = true;
      });

      for (const studentData of studentsData) {
        const requiredFields = [
          "user",
          "fullName",
          "email",
          "mobile",
          "dateOfBirth",
          "gender",
          "height",
          "weight",
          "age",
          "address",
          "city",
          "state",
          "pincode",
          "admissionNo",
          "admissionDate",
          "parentName",
          "parentMobile",
          "classTiming",
        ];
        const missingFields = requiredFields.filter(
          (field) =>
            !studentData.hasOwnProperty(field) || studentData[field] === ""
        );
        if (missingFields.length > 0) {
          return res.status(400).json({
            code: "error",
            message: `Missing required fields: ${missingFields.join(", ")}.`,
          });
        }

        // Check for duplicate email within the same class
        const email = studentData.email.toLowerCase();
        const name = studentData.fullName;
        if (existingEmails.hasOwnProperty(email)) {
          return res.status(400).json({
            code: "error",
            message: `Duplicate user found. Name: ${name}, email: ${email}`,
          });
        }

        // Check for duplicate admission number
        if (existingAdmissionNos.hasOwnProperty(studentData.admissionNo)) {
          return res.status(400).json({
            code: "error",
            message: `Duplicate admission number found: ${studentData.admissionNo}`,
          });
        }

        // Check for duplicate admission ID
        if (existingAdmissionIds.hasOwnProperty(studentData.admissionId)) {
          return res.status(400).json({
            code: "error",
            message: `Duplicate admission ID found: ${studentData.admissionId}`,
          });
        }

        // Check for duplicate phone number
        if (existingPhoneNos.hasOwnProperty(studentData.phoneNo)) {
          return res.status(400).json({
            code: "error",
            message: `Duplicate phone number found: ${studentData.phoneNo}`,
          });
        }

        const student = {
          ...studentData,
          admissionIn: classId, // Ensure admissionIn is added
          club: clubId, // Ensure club is added
        };
        students.push(student);
      }

      const insertedStudents = await Student.insertMany(students);
      if (insertedStudents) {
        return res.status(200).json({
          code: "created",
          message: "Bulk students were uploaded successfully.",
          data: insertedStudents,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({
        code: "error",
        message: "An error occurred while uploading bulk students.",
        data: err,
      });
    }
  },
};
