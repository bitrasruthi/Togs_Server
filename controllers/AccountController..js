const OTPGenerator = require("otp-generator");
const twilio = require("twilio");
const { Login } = require("../models/UserModel");

const accountSid = "ACdd2dcc319eafd01ec98b835786fd9ed9";
const authToken = "27213fbe911d7756874d81ab00c26b98";
const twilioClient = twilio(accountSid, authToken);

module.exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  const otp = OTPGenerator.generate(4, {
    digits: true,
    specialChars: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
  });

  try {
    let userValid = await Login.findOne({ phoneNumber });
    if (userValid) {
      userValid.otp = otp;
      await userValid.save();
    } else {
      userValid = new Login({
        phoneNumber,
        otp,
        fullName: "",
        emailId: "",
        gender: "",
        dateOfBirth: "",
        location: "",
      });
      await userValid.save();
    }

    twilioClient.messages
      .create({
        body: `Your OTP is: ${otp}`,
        from: "+14179003408",
        to: `+91${phoneNumber}`,
      })
      .then(() => {
        console.log(`OTP sent to ${phoneNumber}`);
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error("Failed to send OTP:", error);
        res.sendStatus(500);
      });
  } catch (error) {
    console.log("Something went wrong", error);
    res.sendStatus(500);
  }
};

module.exports.verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    let existingUser = await Login.findOne({ phoneNumber });
    if (existingUser) {
      if (otp == existingUser.otp) {
        res.status(200).json({
          message: "Account created successfully",
          data: existingUser,
          success: true,
        });
      } else {
        res
          .status(400)
          .json({ code: 100, message: "Invalid OTP", success: false });
      }
    }
  } catch (error) {
    res.status(500).json({
      code: 101,
      message: "Phone number does not exists",
      success: false,
    });
  }
};
