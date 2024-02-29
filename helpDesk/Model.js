const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    category: { type: String, required: true },
    Date: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    club: { type: String, required: true },
    ticketId: { type: String , required: true },
    assignee: { type:String , required: true }, 
    description : {type:String , required:true},
    addedBy : {type :String , required:true},
    clubId:{type:String , required:true},
    assigneeId:{type:String , required:true},
  },
  { collection: "tickets", timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
