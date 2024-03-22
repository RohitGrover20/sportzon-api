const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const seriveId = process.env.TWILIO_VERIFY_SERVICE_ID

const client = require('twilio')(accountSid, authToken)
const User = require("../users/Model"); // Assuming this is your user model

module.exports = {
  // Otpsend: (req, res) => {
  //   console.log("otp-send")
  //   const phone="+91"+req.body.phone
  //   client.verify.v2.services(seriveId)
  //     .verifications
  //     // .create({ to: req.body.phone, channel: "sms" })
  //     .create({ to: phone, channel: "sms" })
  //     .then(data => {
  //       res.status(200).json({
  //         code: 'success',
  //         data: { phone: req.body.phone },
  //         message: "Otp sent"
  //       })
  //     })
  //     .catch(err => {
  //       res.status(200).json({
  //         code: 'error',
  //         data: err,
  //         message: "Otp not sent"
  //       })
  //     })
  // },

  // verifyOtp: (req, res) => {
  //   client.verify.v2.services(seriveId)
  //     .verificationChecks
  //     .create({ to: req.body.phone, code: req.body.otp })
  //     .then(data => {
  //       if (data.valid == true) {
  //         res.status(200).json({
  //           code: 'success',
  //           data: { phone: req.body.phone, valid: data.valid },
  //           message: "Otp verified"
  //         })
  //       } else {
  //         res.status(200).json({
  //           code: 'error',
  //           data: { phone: req.body.phone, valid: data.valid },
  //           message: "Invalid Otp"
  //         })
  //       }
  //     })
  //     .catch(err => {
  //       res.status(200).json({
  //         code: 'error',
  //         data: err,
  //         message: "Otp not verified"
  //       })
  //     })
  // }
  Otpsend: async (req, res) => {
    try {
      // Check if phone number exists for the logged-in user
      const user = await User.findOne({ mobile: req.body.phone });
      if (!user) {
        return res.status(400).json({
          code: 'error',
          message: 'Phone number does not exist for the logged-in user',
          data: null
        });
      }

      const phone = "+91" + req.body.phone;
      client.verify.v2.services(seriveId)
        .verifications
        .create({ to: phone, channel: "sms" })
        .then(data => {
          res.status(200).json({
            code: 'success',
            data: { phone: req.body.phone },
            message: "Otp sent"
          });
        })
        .catch(err => {
          res.status(200).json({
            code: 'error',
            data: err,
            message: "Otp not sent"
          });
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        code: 'error',
        message: 'Please try again later!',
        data: null
      });
    }
  },
  verifyOtp: async (req, res) => {
    try {
      if (req.body.mobile == undefined || req.body.otp == undefined) {
        res.send("Invalid request");
      } else {
        const phone ="+91"+req.body.mobile;
        // Verify OTP using Twilio
        const twilioVerification = await client.verify.v2.services(seriveId)
          .verificationChecks
          .create({ to: phone, code: req.body.otp });

        // If Twilio verification is successful
        if (twilioVerification.valid) {
          // Update user in database to mark OTP as verified
          const updateUser = await User.findOneAndUpdate(
            { mobile: req.body.mobile },
            { OtpVerified: true, userOtp: null }
          );

          // If user update is successful
          if (updateUser) {
            return res.status(200).json({
              code: "verified",
              data: 1,
              message: "User has been verified using OTP",
            });
          } else {
            return res.status(400).json({
              code: "error",
              data: 0,
              message: "Failed to update user status",
            });
          }
        } else {
          return res.status(400).json({
            code: "unverified",
            data: 0,
            message: "Invalid OTP",
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "error",
        data: 0,
        message: "Sorry, we couldn't verify using OTP",
      });
    }
  },
};
