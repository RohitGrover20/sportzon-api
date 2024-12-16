const nodemailer = require("nodemailer");

const mailTransport = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILAPP_PASSWORD, 
  },
  debug: true,
});

module.exports = {
  sendEmail: async (req, res) => {
    try {
      const email = {
        from: process.env.EMAIL,
        to: [
          "Sportzon <info@sportzon.in> ",
          `${req?.body?.name} <${req?.body?.email}>`,
        ],
        subject: `Sportzon - ${req?.body?.subject}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2c3e50; text-align: center;">Thank you for your enquiry!</h2>
          <p style="color: #34495e;">Hello ${req?.body?.name},</p>
          <p style="color: #34495e;">We have received your message and will get back to you shortly. Here are the details you provided:</p>
          <p><strong>Name:</strong> ${req?.body?.name}</p>
          <p><strong>Email:</strong> ${req?.body?.email}</p>
          <p><strong>Phone:</strong> ${req?.body?.phone}</p>
          <p><strong>Message:</strong></p>
          <p style="color: #34495e; background: #ecf0f1; padding: 10px; border-radius: 5px;">${req?.body?.message}</p>
          <p style="color: #34495e;">Thank you,<br>The Sportzon Team</p>
          <hr style="border: 0; border-top: 1px solid #ecf0f1; margin: 20px 0;">
          <div style="text-align: center;">
            <p style="color: #7f8c8d;">Connect with us on social media</p>
            <a href="https://www.facebook.com/sportzonindia/" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=118497&format=png" alt="Facebook" style="width: 30px;"></a>
            <a href="https://www.linkedin.com/company/sportzon-india/" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=13930&format=png" alt="LinkedIn" style="width: 30px;"></a>
            <a href="https://youtube.com/sportzonindia" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=Xy10Jcu1L2Su&format=png" alt="YouTube" style="width: 30px;"></a>
            <a href="https://www.youtube.com/@sportzongameon" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=19318&format=png" alt="YouTube" style="width: 30px;"></a>
            </div>
          <hr style="border: 0; border-top: 1px solid #ecf0f1; margin: 20px 0;">
          <div style="text-align: center; color: #34495e;">
            <p>If you have any further questions, feel free to contact us at:</p>
            <p><strong>Email:</strong> <a href="mailto:info@sportzon.in" style="color: #3498db;">info@sportzon.in</a></p>
          </div>
        </div>
      `,
      };
      const send = await mailTransport.sendMail(email);

      if (send) {
        return res.status(200).json({
          code: "sent",
          message: "Your form has been submitted successfully.",
          data: false,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: err,
      });
    }
  },

  offeringEmail: async (req, res) => {
    try {
      const email = {
        from: "Sportzon <info@sportzon.in>",
        to: [
          "Sportzon <info@sportzon.in> ",
          `${req?.body?.name} <${req?.body?.email}>`,
        ],
        subject: `Sportzon Offerings Enquiry`,
        // text: `
        //   Name: ${req.body.name}
        //   Email: ${req.body.email}
        //   Phone: ${req.body.phone}
        //   Institution/ Corporates: ${req.body.org}
        //   Message: ${req.body.message}`
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center;">
            <img src="https://sportzon.in/_next/image?url=%2Fassets%2Fimg%2FLogo-Header.png&w=256&q=75" alt="Sportzon Logo" style="max-width: 200px; margin-bottom: 20px;">
          </div>
          <h2 style="color: #2c3e50; text-align: center;">Thank you for your enquiry!</h2>
          <p style="color: #34495e;">Hello ${req?.body?.name},</p>
          <p style="color: #34495e;">We have received your message and will get back to you shortly. Here are the details you provided:</p>
          <p><strong>Name:</strong> ${req?.body?.name}</p>
          <p><strong>Email:</strong> ${req?.body?.email}</p>
          <p><strong>Phone:</strong> ${req?.body?.phone}</p>
          <p><strong>Institution/Corporates:</strong> ${req?.body?.org}</p>
          <p><strong>Message:</strong></p>
          <p style="color: #34495e; background: #ecf0f1; padding: 10px; border-radius: 5px;">${req?.body?.message}</p>
          <p style="color: #34495e;">Thank you,<br>The Sportzon Team</p>
          <hr style="border: 0; border-top: 1px solid #ecf0f1; margin: 20px 0;">
          <div style="text-align: center;">
            <p style="color: #7f8c8d;">Connect with us on social media</p>
            <a href="https://www.facebook.com/sportzonindia/" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=118497&format=png" alt="Facebook" style="width: 30px;"></a>
            <a href="https://www.linkedin.com/company/sportzon-india/" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=13930&format=png" alt="LinkedIn" style="width: 30px;"></a>
            <a href="https://youtube.com/sportzonindia" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=Xy10Jcu1L2Su&format=png" alt="YouTube" style="width: 30px;"></a>
            <a href="https://www.youtube.com/@sportzongameon" style="margin: 0 10px;"><img src="https://img.icons8.com/?size=96&id=19318&format=png" alt="YouTube" style="width: 30px;"></a>
            </div>
          <hr style="border: 0; border-top: 1px solid #ecf0f1; margin: 20px 0;">
          <div style="text-align: center; color: #34495e;">
            <p>If you have any further questions, feel free to contact us at:</p>
            <p><strong>Email:</strong> <a href="mailto:info@sportzon.in" style="color: #3498db;">info@sportzon.in</a></p>
          </div>
        </div>
      `,
      };

      const send = await mailTransport.sendMail(email);

      if (send) {
        return res.status(200).json({
          code: "sent",
          message: "Your form has been submitted successfully.",
          data: false,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: err,
      });
    }
  },
};
