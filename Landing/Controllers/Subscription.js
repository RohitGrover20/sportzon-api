const Subscription = require("../../subscription/Model");
const { SubscriptionBooking } = require("../../subscriptionBookings/Model");
const Wallet = require("../../creditwallet/Model");
const Payment = require("../Models/Payments");
const nodemailer = require("nodemailer");

// twillio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const seriveId = process.env.TWILIO_VERIFY_SERVICE_ID;
const client = require("twilio")(accountSid, authToken);
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

const sendSubscriptionEmail = async (userEmail, subscriptionData) => {
  const email = {
    from: "Sportzon <info@sportzon.in>",
    to: ["Sportzon <info@sportzon.in>", userEmail],
    subject: `Subscription Confirmation - ${subscriptionData?.planName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f7f7f7;">
        <h1 style="text-align: center;color:#F04A00">Welcome To Sportzon!</h1>
        <h2 style="color: #0a5993; text-align: center;">Subscription Confirmation</h2>
        <p style="color: #34495e;">Hello, Thank you for subscribing to our membership plan.
        <br/> Here are your subscription details:</p>
        <p><strong style="color: #F04A00;">Plan Name:</strong> ${subscriptionData?.planName}</p>
        <p><strong style="color: #F04A00;">Order Id:</strong> ${subscriptionData?.orderId}</p>
        <p><strong style="color: #F04A00;">Start Date:</strong> ${subscriptionData?.startDate}</p>
        <p><strong style="color: #F04A00;">End Date:</strong> ${subscriptionData?.endDate}</p>
        <h4 style="color: #F04A00;">We look forward to helping you make the most of your ${subscriptionData?.planName} membership!</h4>
        <p style="color: #34495e;">If you have any questions, feel free to contact us at <a href="mailto:info@sportzon.in" style="color: #3498db;">info@sportzon.in</a>.</p>
        <p style="color: #34495e;">Thank you,<br>The Sportzon Team</p>
        <hr style="border: 0; border-top: 1px solid #ecf0f1; margin: 20px 0;">
        <div style="text-align: center;">
            <p style="color: #7f8c8d;">Connect with us on social media</p>
            <a href="https://www.facebook.com/sportzonindia/" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=118497&format=png" alt="Facebook" style="width: 30px;"></a>
            <a href="https://www.linkedin.com/company/sportzon-india/" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=13930&format=png" alt="LinkedIn" style="width: 30px;"></a>
            <a href="https://www.instagram.com/sportzonindia/" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=Xy10Jcu1L2Su&format=png" alt="Instagram" style="width: 30px;"></a>
            <a href="https://www.youtube.com/@sportzongameon" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=19318&format=png" alt="YouTube" style="width: 30px;"></a>
        </div>
      </div>
    `,
  };
  try {
    await mailTransport.sendMail(email);
    console.log("Subscription email sent successfully to:", userEmail);
  } catch (error) {
    console.error("Error sending subscription email:", error);
  }
};

const sendSubscriptionSMS = async (userPhone, subscriptionData) => {
  const message = `🎉 Thank you for subscribing to Sportzon! 🎉
    Plan Name: ${subscriptionData?.planName}
    Order Id: ${subscriptionData?.orderId}
    Start Date: ${subscriptionData?.startDate}
    End Date: ${subscriptionData?.endDate}
We look forward to serving you. For more details, visit our website: www.sportzon.in

Best regards,
The Sportzon Team`;

  const superAdminMessage = `
📣 New Subscription Notification 📣
    Plan Name: ${subscriptionData?.planName}
    Order Id: ${subscriptionData?.orderId}
A new subscription has been successfully purchased on the Sportzon Website!
For more details, visit our website: www.sportzon.in

Best regards,
The Sportzon Team
`;

  try {
    const fromPhone = process.env.TWILIO_PHONE_NO;
    if (!fromPhone) {
      throw new Error("TWILIO_PHONE_NO environment variable is not set.");
    }
    await client.messages.create({
      body: message,
      from: fromPhone,
      to: `91${userPhone}`,
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
  }

  try {
    const fromPhone = process.env.TWILIO_PHONE_NO;
    if (!fromPhone) {
      throw new Error("TWILIO_PHONE_NO environment variable is not set.");
    }
    await client.messages.create({
      body: superAdminMessage,
      from: fromPhone,
      to: `91${process.env.ADMIN_PHONE_NO}`,
    });
  } catch (error) {
    console.error("Error sending admin notification SMS:", error);
  }
};

module.exports = {
  getSubscriptionPlan: async (req, res) => {
    try {
      const subscription = await Subscription.find({}).sort({ createdAt: -1 });
      if (subscription) {
        return res.status(200).json({
          code: "fetched",
          message: "subscription plan were fetched.",
          data: subscription,
        });
      }
    } catch (err) {
      return res.status(200).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: err,
      });
    }
  },
  SubscriptionProcess: async (req, res) => {
    const amount = req?.body?.data?.amount;
    // let result;

    // if (amount === 49900) {
    //   result = 0; // No 10% addition
    // } else {
    //   result = Number(((amount / 100) * (10 / 100) + amount / 100).toFixed(0));
    // }

    try {
      const payment = await Payment.create({
        user: req.user._id,
        razorpay_order_id: req?.body?.response?.razorpay_order_id,
        razorpay_payment_id: req?.body?.response?.razorpay_payment_id,
        razorpay_signature: req?.body?.response?.razorpay_signature,
        status: "paid",
      });

      // Create a Subscription Booking document
      const subscriptionData = {
        ...req.body.data,
        userDetails: req.user,
        user: req.user._id,
        bookingId:
          "BKG" +
          Math.floor(Math.random() * 100) +
          "SUBSCRIPTION" +
          new Date().getTime(),
        orderId: req?.body?.response?.razorpay_order_id,
        club: req?.user?.club,
        status: "Completed",
      };
      const booking = await SubscriptionBooking.create(subscriptionData);

      // Create a new wallet transaction entry
      //   let walletEntry;
      //   if(result!=0){
      //    walletEntry = new Wallet({
      //     userId: req.user,
      //     type: "credit",
      //     // amount: Number((req.body.amount/100) * (10/100) + req.body.amount),
      //     amount: result,
      //     club: req?.user?.club, // Assuming the subscription is linked to a club
      //     description: `Coins credited for buying subscription`,
      //   });
      // }

      //   await walletEntry.save();
      await sendSubscriptionEmail(req?.user?.email, subscriptionData);
      await sendSubscriptionSMS(req?.user?.mobile, subscriptionData);

      // Return the booking data in the response
      return res.status(200).json({
        code: "booked",
        message: "You are member of sportzon Now",
        data: booking,
      });
    } catch (error) {
      console.error("Error processing booking:", error);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: error.message,
      });
    }
  },
  mySubscriptions: async (req, res) => {
    try {
      const booking = await SubscriptionBooking.find({
        user: req.user._id,
      }).sort({ createdAt: -1 });
      if (booking) {
        return res.status(200).json({
          code: "fetched",
          message: "Subscriptions were fetched",
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
};
