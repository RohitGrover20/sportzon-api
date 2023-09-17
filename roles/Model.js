const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    permissions: { type: Array, required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  },
  { collection: "roles", timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
