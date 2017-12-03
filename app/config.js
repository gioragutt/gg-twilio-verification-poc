require('dotenv').config()

module.exports = {
  PORT: process.env.PORT || 3000,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  AUTHY_AUTH_KEY: process.env.AUTHY_AUTH_KEY,
}