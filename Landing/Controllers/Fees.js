const Fees = require("../../fees/Model");
const Payment = require("../Models/Payments");
const nodemailer = require("nodemailer");

// twillio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const seriveId = process.env.TWILIO_VERIFY_SERVICE_ID;
const client = require("twilio")(accountSid, authToken);

const mailTransport = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL, // Your Guite email address
    pass: process.env.EMAILAPP_PASSWORD, // Your Guite email password
  },
  debug: true,
});

const sendPaymentConfirmationEmail = async (userEmail, paymentData) => {
  const email = {
    from: "Sportzon <info@sportzon.in>",
    to: ["Sportzon <info@sportzon.in>", userEmail],
    subject: `Class Fee Payment Confirmation`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f7f7f7;">
        <h1 style="text-align: center;color:#F04A00">Thank You for Your Payment!</h1>
        <h2 style="color: #0a5993; text-align: center;">Payment Confirmation</h2>
        <p style="color: #34495e;">Hello,</p>
        <p>Thank you for your payment. Here are the details of your transaction:</p>
        <p><strong style="color: #F04A00;">Transaction ID:</strong> ${paymentData?.transactionId}</p>
        <p><strong style="color: #F04A00;">Paid Amount:</strong> ₹${paymentData?.paidAmount}</p>
        <p><strong style="color: #F04A00;">GST:</strong> ₹${paymentData?.gst}</p>
        <p><strong style="color: #F04A00;">Total Amount:</strong> ₹${paymentData?.feeWithGst}</p>
        <p><strong style="color: #F04A00;">Date of Payment:</strong> ${paymentData?.paidOn}</p>
        <h4 style="color: #F04A00;">Thank you for your prompt payment. We look forward to seeing you in class!</h4>
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
  } catch (error) {
    console.error("Error sending payment confirmation email:", error);
  }
};

const sendBookingSMS = async (userPhone, paymentData) => {
  const message = `💰 Class Fee Payment Confirmation 💰
  Paid Amount: ₹${paymentData?.paidAmount}
  GST: ₹${paymentData?.gst}
  Total Amount: ₹${paymentData?.feeWithGst}
  Payment Date: ${paymentData?.paidOn}
  
  Thank you for your payment! For more details, visit our website: www.sportzon.in

  Best regards,
  The Sportzon Team`;
  const superAdminMessage = `📣 Fee Payment Notification 📣
    A fee payment has been successfully processed on Sportzon Website!
    Paid Amount: ₹${paymentData?.paidAmount}
    For more details, visit our website: www.sportzon.in

    Best regards,
    The Sportzon Team`;

  try {
    const fromPhone = process.env.TWILIO_PHONE_NO;
    if (!fromPhone) {
      throw new Error("TWILIO_PHONE_NO environment variable is not set.");
    }
    await client.messages.create({
      body: message,
      // from: +7082953508,
      from: `${process.env.TWILIO_PHONE_NO}`,
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
      // from: +7082953508,
      from: `${process.env.TWILIO_PHONE_NO}`,
      to: `91${process.env.ADMIN_PHONE_NO}`,
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

module.exports = {
  myFees: async (req, res) => {
    try {
      const classes = req.params.class;
      const student = req.params.student;
      const fees = await Fees.find({ student: student, class: classes }).sort({
        createdAt: "-1",
      });
      if (fees) {
        return res.status(200).json({
          code: 1,
          message: "Fees were fetched",
          data: fees,
        });
      }
    } catch (err) {
      return res.status(400).json({
        code: 0,
        message: "Something went wrong. Please try again.",
        data: err,
      });
    }
  },
  FeePayment: async (req, res) => {
              // Send confirmation email
              // await sendPaymentConfirmationEmail(req?.body?.email);
              // await sendBookingSMS(req?.body?.mobile);
    try {
      if (true) {
        const fees = await Fees.create({
          class: req?.body?.class,
          student: req?.body?.student,
          paymentMethod: "online",
          paymentType: "Monthly",
          transactionId: req.body.response.razorpay_payment_id,
          club: req?.body?.club,
          subtotal: req.body.subtotal,
          gst: req.body.gst,
          feeWithGst: Number(req.body.paidAmount),
          feeWithoutGst: Number(req.body.paidAmount - req.body.gst),
          paidAmount: req.body.paidAmount,
          paidOn: new Date().toISOString(),
          feeDate: new Date().toDateString(),
          balance: req.body.balance,
          discount: req.body.discount,
          month: req.body.month,
          year: req.body.year,
          description: req.body.description,
          status: "paid",
        });
        if (fees) {
          const paymentData = {
            student: req?.body?.student,
            class: req?.body?.class,
            transactionId: req.body.response.razorpay_payment_id,
            paidAmount: req.body.paidAmount,
            gst: req.body.gst,
            feeWithGst: Number(req.body.paidAmount),
            paidOn: new Date().toDateString(),
          };
          // Send confirmation email
          await sendPaymentConfirmationEmail(req?.body?.email, paymentData);
          await sendBookingSMS(req?.body?.contact, paymentData);

          return res.status(200).json({
            data: fees,
            message: "Payment Done successfully.",
            code: "created",
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        data: err,
        message: "Error occured",
        code: "error",
      });
    }
  },
};
