const Ticket = require("./Model");
const Club = require("../club/Model");
const User = require("../users/Model");
function generateTicketId() {
  const prefix = "SZT"; // Fixed prefix
  const randomString = Math.random().toString(36).substring(2, 6); // Short random string
  return `${prefix}${randomString}`;
}

// Usage in your code
const ticketId = generateTicketId();
module.exports = {
  addTicket: async (req, res) => {
    try {
      const checkTicket = await Ticket.findOne({ ticketId: ticketId });

      if (checkTicket) {
        return res.status(200).json({
          code: "duplicate",
          message: "Ticket already exists",
          data: 0,
        });
      } else {
        const ticketId = generateTicketId();
        const club = await Club.findById(req.user.club);
        const superAdmin = await User.findOne({
          role: process.env.SUPERADMINROLE,
        });

        const ticket = await Ticket.create({
          ...req.body,
          clubId : club._id,
          club: club.title,
          ticketId: ticketId ? ticketId : "",
          assignee: superAdmin?.firstName,
          assigneeId: superAdmin?._id,
          addedBy: req.user.firstName,
        });
        if (ticket) {
          return res.status(200).json({
            code: "created",
            data: ticket,
            message: "Ticket was created successfully.",
          });
        } else {
          return res.status(400).json({
            code: "error",
            message: "Failed to create ticket",
            data: null,
          });
        }
      }
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({
        code: "server_error",
        message: "Internal server error",
        data: null,
      });
    }
  },
  getTickets: async (req, res) => {
    try {
      let query;
      if (
        process.env.SUPERADMINROLE == req.user.role &&
        process.env.SUPERADMINCLUB == req.user.club
      ) {
        query = Ticket.find();
      } else {
        query = Ticket.find({
          $or: [
            { assigneeId: req.user._id, clubId: req.user.club },
            {  clubId: req.user.club },
          ],
        });
      }
      const tickets = await query;
      const closedTickets = await Ticket.countDocuments({
        status: "Closed",
      });
      const pendingTickets = await Ticket.countDocuments({
        status: "In Progress",
      });
      const openTickets = await Ticket.countDocuments({status : "Open"})
      const totalTickets = await Ticket.countDocuments();

      const data = ({
        tickets : tickets,
       closedCount : closedTickets,
        pendingCount : pendingTickets,
        totalCount : totalTickets,
        openCount : openTickets,
      });
      if (tickets) {
        return res.status(200).json({
          code: "fetched",
          message: "Tickets were fetched",
          data: data,
        });
      }
    } catch (error) {
      return res.status(400).json({
        code: "error",
        message: "Something went wrong",
        data: error,
      });
    }
  },
  EditTickets: async (req, res) => {
    try {
      const update = await Ticket.findOneAndUpdate(
        {
          _id: req.body.id,
        },
        req.body,
        {
          new: true,
        }
      );

      if (update) {
        if (update) {
          const assigneeUserId = req.body.assigneeId; // Extract user ID from the request body
          const assigneeUserName = req.body.assignee; // Extract user name from the request body
          const clubId = req.user.club; 

          // Update the assignee's ticket list with the updated ticket data
          await Ticket.updateOne(
            { _id: req.body.id },
        { assigneeId: assigneeUserId, clubId }
          );
      }
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
};
