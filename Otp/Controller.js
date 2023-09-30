const SendOtp = require("sendotp");

const sendOtp = new SendOtp("406980AOHaQwzs6517ca1eP1");

module.exports = {
  Otpsend: (req, res) => {
    sendOtp.send("919971081358", "Sportz", "4635", function (error, data) {
      if (data) {
        return res.status(200).json({
          code: 1,
          data: data,
          message: "Otp sent",
        });
      } else {
        console.log(error);
      }
    });
  },

  verifyOtp: (req, res) => {
    sendOtp.verify("919971081358", "4635", (error, data) => {
      if (data) {
        return res.status(200).json({
          code: 1,
          data: data,
          message: "Otp sent",
        });
      } else {
        console.log(error);
      }
    });
  },
};
