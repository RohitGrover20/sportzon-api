const Arena = require("./Model");
const fs = require("fs");

module.exports = {
  addArena: async (req, res) => {
    try {
      const isArena = await Arena.exists({
        slug: req.body.slug,
        club: req.body.club,
      });
      
      if (isArena) {
        return res.status(200).json({
          data: 0,
          message: "Arena already exists",
          code: "duplicate",
        });
      } else {
        // Manually combine all gallery files into a single array
        const gallery = [];
        if (req.files['gallery[0]']) gallery.push(req.files['gallery[0]'][0].location);
        if (req.files['gallery[1]']) gallery.push(req.files['gallery[1]'][0].location);
        if (req.files['gallery[2]']) gallery.push(req.files['gallery[2]'][0].location);
        if (req.files['gallery[3]']) gallery.push(req.files['gallery[3]'][0].location);
        if (req.files['gallery[4]']) gallery.push(req.files['gallery[4]'][0].location);
        const agreement = req.files['agreement']?.[0]?.location || null; // Assuming only one PDF is uploaded
  
        const addArena = await Arena.create({
          ...req.body,
          gallery: gallery, // Array of image locations
          agreement: agreement, // Save the PDF location if necessary
          club: req.user.club,
        });
  
        if (addArena) {
          return res.status(200).json({
            data: addArena,
            message: "Arena added successfully",
            code: "created",
          });
        }
      }
    } catch (err) {
      return res.status(400).json({
        data: err.message,
        message: "Error occurred",
        code: "error",
      });
    }
  },  

  getArena: async (req, res) => {
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Arena.find();
      } else {
        query = Arena.find({ club: req.user.club });
      }

      const arena = await query.populate("club").sort({ createdAt: -1 });
      if (arena) {
        return res.status(200).json({
          data: arena,
          message: "Arena were fetched",
          code: "fetched",
        });
      }
    } catch (err) {
      return res.status(400).json({
        data: err,
        message: "Error occured",
        code: "error",
      });
    }
  },

  getArenaBySlugOrId: async (req, res) => {
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Arena.findOne({ slug: req.body.slug });
      } else {
        query = Arena.findOne({ slug: req.body.slug, club: req.user.club });
      }

      const arena = await query;
      if (arena) {
        return res.status(200).json({
          data: arena,
          message: "Arena were fetched",
          code: "fetched",
        });
      }
    } catch (error) {
      return res.status(200).json({
        data: error,
        message: "Something went wrong",
        code: "error",
      });
    }
  },

  EditArena: async (req, res) => {
    try {
      // Check if the arena exists by its ID and club
      const isArena = await Arena.exists({
        _id: req.body._id,
        club: req.body.club,
      });
  
      if (!isArena) {
        return res.status(404).json({
          data: 0,
          message: "Arena not found",
          code: "not_found",
        });
      } else {
        // Manually combine all gallery files into a single array (similar to addArena)
        const gallery = [];
        if (req.files['gallery[0]']) gallery.push(req.files['gallery[0]'][0].location);
        if (req.files['gallery[1]']) gallery.push(req.files['gallery[1]'][0].location);
        if (req.files['gallery[2]']) gallery.push(req.files['gallery[2]'][0].location);
        if (req.files['gallery[3]']) gallery.push(req.files['gallery[3]'][0].location);
        if (req.files['gallery[4]']) gallery.push(req.files['gallery[4]'][0].location);
        const agreement = req.files['agreement']?.[0]?.location || null; // Update agreement file if uploaded
  
        // Update the arena with new data
        const updatedArena = await Arena.findOneAndUpdate(
          { _id: req.body._id },
          {
            ...req.body,
            gallery: [...gallery, ...(req.body.gallery || [])], // Merge uploaded files and existing gallery
            agreement: agreement || req.body.agreement, // Keep the existing agreement if no new file uploaded
          },
          { new: true }
        );
  
        if (updatedArena) {
          return res.status(200).json({
            data: updatedArena,
            message: "Arena updated successfully",
            code: "updated",
          });
        }
      }
    } catch (err) {
      return res.status(400).json({
        data: err.message,
        message: "Error occurred",
        code: "error",
      });
    }
  },
};
