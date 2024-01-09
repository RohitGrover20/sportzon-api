const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rohit@citiskape.in",
    pass: "okpzemrtiypmmfyz",
    // pass: "josjkcjvujswagrw",
  },
});

module.exports = {
  sendEmail: async (req, res) => {
    try {
      const email = {
        from: "Sportzon rohit@citiskape.in",
        to: "Rohit rohit@citiskape.in",
        subject: `Sportzon - ${req.body.subject}`,
        text: `
    Name: ${req.body.name}
    Email: ${req.body.email}
    Message: ${req.body.message}`,
      };

      const send = await transport.sendMail(email);
      if (send) {
        return res.status(200).json({
          code: "sent",
          message: "You form has been submitted successfully.",
          data: false,
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

  offeringEmail: async (req, res) => {
    try {
      const email = {
        from: "Sportzon rohit@citiskape.in",
        to: "Rohit rohit@citiskape.in",
        subject: `Sportzon - ${req.body.subject}`,
        text: `
    Name: ${req.body.name}
    Email: ${req.body.email}
    Phone: ${req.body.phone}
    Institution/ Corporates: ${req.body.org}
    Message: ${req.body.message}
  `,
      };

      const send = await transport.sendMail(email);
      if (send) {
        return res.status(200).json({
          code: "sent",
          message: "You form has been submitted successfully.",
          data: false,
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
