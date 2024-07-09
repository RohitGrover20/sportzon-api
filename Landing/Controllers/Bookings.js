const { Booking } = require("../../bookings/Model");
const Event = require("../../events/Model");
const Payment = require("../Models/Payments");
const nodemailer = require("nodemailer");

// Your GoDaddy email credentials
const godaddyEmail = "info@sportzon.in";
const godaddyPassword = "Rohit@2189";

// Setting up the transporter
const mailTransport = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  secure: true,
  secureConnection: false, // TLS requires secureConnection to be false
  tls: {
    ciphers: "SSLv3",
  },
  requireTLS: true,
  port: 465,
  debug: true,
  auth: {
    user: godaddyEmail,
    pass: godaddyPassword,
  },
});

const sendBookingEmail = async (userEmail, bookingData) => {
  const email = {
    from: "Sportzon <info@sportzon.in>",
    // to: userEmail,
    to: [
      "Sportzon <info@sportzon.in> ",
      userEmail,
    ],
    subject: `Booking Confirmation - ${bookingData.bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f7f7f7;">
        <h1 style="text-align: center;color:#F04A00">Welcome To Sportzon !</h1>
        <h2 style="color: #0a5993
; text-align: center;">Booking Confirmation</h2>
        <p style="color: #34495e;">Hello, Thank you for your booking.
        <br/> Here are your booking details:</p>
        <p><strong style="color: #F04A00;">Booking ID:</strong> ${bookingData.bookingId}</p>
        <p><strong style="color: #F04A00;">Booking Type:</strong> ${bookingData.bookingType === 'event' ? 'Event' : 'Venue'}</p>
        <p><strong style="color: #F04A00;">Status:</strong> ${bookingData.status}</p>
        <h4 style="color: #F04A00;">We look forward to seeing you. Enjoy your ${bookingData.bookingType === 'event' ? 'event' : 'venue booking'}!</h4>
        <p style="color: #34495e;">If you have any questions, feel free to contact us at <a href="mailto:info@sportzon.in" style="color: #3498db;">info@sportzon.in</a>.</p>
        <p style="color: #34495e;">Thank you,<br>The Sportzon Team</p>
        <hr style="border: 0; border-top: 1px solid #ecf0f1; margin: 20px 0;">
        <div style="text-align: center;">
            <p style="color: #7f8c8d;">Connect with us on social media</p>
            <a href="https://www.facebook.com/sportzonindia/" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=118497&format=png" alt="Facebook" style="width: 30px;"></a>
            <a href="https://www.linkedin.com/company/sportzon-india/" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=13930&format=png" alt="LinkedIn" style="width: 30px;"></a>
            <a href="https://youtube.com/sportzonindia" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=Xy10Jcu1L2Su&format=png" alt="YouTube" style="width: 30px;"></a>
            <a href="https://www.youtube.com/@sportzongameon" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=19318&format=png" alt="YouTube" style="width: 30px;"></a>
            </div>
      </div>
    `
  };
  try {
    await mailTransport.sendMail(email);
    console.log("Email sent successfully to:", userEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
module.exports = {
  myBookings: async (req, res) => {
    try {
      const booking = await Booking.find({ user: req.user._id })
        .populate(["arena", "court", "event"])
        .sort({ createdAt: -1 });
      if (booking) {
        return res.status(200).json({
          code: "fetched",
          message: "You bookings were fetched",
          data: booking,
        });
      }
    } catch (err) {
      return res.status(400).json({
        code: "error",
        message: "We couldn't fetched booking. Please try again",
        data: err,
      });
    }
  },

  Process: async (req, res) => {
    try {
      // Create a Payment document
      const { paymentMethod } = req.body.data;
      if (paymentMethod === "Cash on Delivery") {
        // Initialize payment method and booking data
        let payment;
        const bookingData = {
          ...req.body.data,
          user: req.user._id,
          bookingId:
            "CSHV" +
            Math.floor(Math.random() * 100) +
            req.body.data.bookingType.toUpperCase() +
            new Date().getTime(),
          club: req.body.data.club,
          status: "Completed",
        };

        payment = await Payment.create({
          user: req.user._id,
          status: "Cash on Delivery",
        });

        const booking = await Booking.create(bookingData);
        // If booking type is event, update the emptySlots field in the corresponding Event document
        if (bookingData.bookingType === "event") {
          const event = await Event.updateOne(
            { _id: bookingData.event },
            { $inc: { emptySlots: -1 } }
          );
          if (!event) {
            throw new Error("Failed to update event slots");
          }
        }
        await sendBookingEmail(req.body.data.email, bookingData);
        // Return the booking data in the response
        return res.status(200).json({
          code: "booked",
          message: "Booking placed successfully",
          data: booking,
        });
      } else {
        const payment = await Payment.create({
          user: req.user._id,
          razorpay_order_id: req?.body?.response?.razorpay_order_id,
          razorpay_payment_id: req?.body?.response?.razorpay_payment_id,
          razorpay_signature: req?.body?.response?.razorpay_signature,
          status: "paid",
        });

        // Create a Booking document
        const bookingData = {
          ...req.body.data,
          user: req.user._id,
          bookingId:
            "BKG" +
            Math.floor(Math.random() * 100) +
            req.body.data.bookingType.toUpperCase() +
            new Date().getTime(),
          orderId: req?.body?.response?.razorpay_order_id,
          club: req.body.data.club,
          status: "Completed",
          eventStatus:"Completed"
        };
        const booking = await Booking.create(bookingData);
        // If booking type is event, update the emptySlots field in the corresponding Event document
        if (bookingData.bookingType === "event") {
          const event = await Event.updateOne(
            { _id: bookingData.event },
            { $inc: { emptySlots: -1 } ,
            $set: { eventStatus: "Completed" }
          }
          );
          if (!event) {
            throw new Error("Failed to update event slots");
          }
        }
        await sendBookingEmail(req.body.data.email, bookingData);

        // Return the booking data in the response
        return res.status(200).json({
          code: "booked",
          message: "Booking placed successfully",
          data: booking,
        });
      }
    } catch (error) {
      console.error("Error processing booking:", error);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: error.message,
      });
    }
  },
};
