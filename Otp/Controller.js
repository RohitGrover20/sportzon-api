const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const seriveId = process.env.TWILIO_VERIFY_SERVICE_ID

const client = require('twilio')(accountSid, authToken)

module.exports = {
  Otpsend: (req, res) => {
    client.verify.v2.services(seriveId)
      .verifications
      .create({ to: req.body.phone, channel: "sms" })
      .then(data => {
        res.status(200).json({
          code: 'success',
          data: { phone: req.body.phone },
          message: "Otp sent"
        })
      })
      .catch(err => {
        res.status(200).json({
          code: 'error',
          data: err,
          message: "Otp not sent"
        })
      })
  },

  verifyOtp: (req, res) => {
    client.verify.v2.services(seriveId)
      .verificationChecks
      .create({ to: req.body.phone, code: req.body.otp })
      .then(data => {
        if (data.valid == true) {
          res.status(200).json({
            code: 'success',
            data: { phone: req.body.phone, valid: data.valid },
            message: "Otp verified"
          })
        } else {
          res.status(200).json({
            code: 'error',
            data: { phone: req.body.phone, valid: data.valid },
            message: "Invalid Otp"
          })
        }
      })
      .catch(err => {
        res.status(200).json({
          code: 'error',
          data: err,
          message: "Otp not verified"
        })
      })
  }
};
