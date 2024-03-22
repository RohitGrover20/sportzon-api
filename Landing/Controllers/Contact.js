// const nodemailer = require("nodemailer");
// const transport = nodemailer.createTransport({
//   host: "smtpout.secureserver.net",  
//   service: 'Godaddy',
//   secureConnection: true, // TLS requires secureConnection to be false
//   tls: {
//       ciphers:'SSLv3'
//   },
//   requireTLS:true,
//   port: 465,
//   debug: true,
//   auth: {
//     user: "info@sportzon.in",
//     pass: "Rohit@2189"
//   },
// });

// module.exports = {
//   sendEmail: async (req, res) => {
//     try {
//       const email = {
//         from: "Sportzon info@sportzon.in",
//         to: `${req.body.name} ${req.body.email}`,
//         subject: `Sportzon - ${req.body.subject}`,
//         text: `
//     Name: ${req.body.name}
//     Email: ${req.body.email}
//     Message: ${req.body.message}`,
//       };
//       console.log( "sssend Email")

//       const send = await transport.sendMail(email);
//       console.log(send , "send Email")
//       if (send) {
//         return res.status(200).json({
//           code: "sent",
//           message: "You form has been submitted successfully.",
//           data: false,
//         });
//       }
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json({
//         code: "error",
//         message: "Something went wrong. Please try again",
//         data: err,
//       });
//     }
//   },

//   offeringEmail: async (req, res) => {
//     try {
//       const email = {
//         from: "Sportzon info@sportzon.in",
//         to: "Rohit info@sportzon.in",
//         subject: `Sportzon - ${req.body.subject}`,
//         text: `
//     Name: ${req.body.name}
//     Email: ${req.body.email}
//     Phone: ${req.body.phone}
//     Institution/ Corporates: ${req.body.org}
//     Message: ${req.body.message}
//   `,
//       };

//       const send = await transport.sendMail(email);
//       if (send) {
//         return res.status(200).json({
//           code: "sent",
//           message: "You form has been submitted successfully.",
//           data: false,
//         });
//       }
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json({
//         code: "error",
//         message: "Something went wrong. Please try again",
//         data: err,
//       });
//     }
//   },
// };



// Importing Nodemailer
const nodemailer = require('nodemailer');

// Your GoDaddy email credentials
const godaddyEmail = 'info@sportzon.in';
const godaddyPassword = 'Rohit@2189';

// Setting up the transporter
const mailTransport = nodemailer.createTransport({    
    host: "smtpout.secureserver.net",  
    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
        ciphers:'SSLv3'
    },
    requireTLS:true,
    port: 465,
    debug: true,
    auth: {
        user: godaddyEmail,
        pass: godaddyPassword 
    }
});

module.exports = {
  sendEmail: async (req, res) => {
    try {
      const email = {
        from: godaddyEmail,
        to: `${req.body.name} ${req.body.email}`,
        subject: `Sportzon - ${req.body.subject}`,
        text:
          `
          Name: ${req.body.name}
          Email: ${req.body.email}
          Message: ${req.body.message}`,
      };
      const send = await mailTransport.sendMail(email);

      if (send) {
        return res.status(200).json({
          code: "sent",
          message: "Your form has been submitted successfully.",
          data: false
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: err
      });
    }
  },

  offeringEmail: async (req, res) => {
    try {
      const email = {
        from: "Sportzon <info@sportzon.in>",
        to: "Rohit <info@sportzon.in>",
        subject: `Sportzon Offerings Emails`,
        text: `
          Name: ${req.body.name}
          Email: ${req.body.email}
          Phone: ${req.body.phone}
          Institution/ Corporates: ${req.body.org}
          Message: ${req.body.message}`
      };

      const send = await mailTransport.sendMail(email);

      if (send) {
        return res.status(200).json({
          code: "sent",
          message: "Your form has been submitted successfully.",
          data: false
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: err
      });
    }
  }
};