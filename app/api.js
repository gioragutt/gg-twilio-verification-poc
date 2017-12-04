const {AUTHY_AUTH_KEY} = require('./config')
const {logger} = require('lib/logger')

const phoneVerification = require('authy')(AUTHY_AUTH_KEY).phones()

const promisify = (instance, fn, ...args) => new Promise((resolve, reject) => fn.apply(instance, [...args, (err, result) => {
  if (err) {
    reject(err.errors.message || err.message || err)
  }
  resolve(result)
}]))

const twilioApi = async (method, ...props) => {
  const result = await promisify(phoneVerification, method, ...props)
  logger.info(result)
  return {message: result.message}
}

/**
 * This behaves as expected - given a valid phone number, an SMS is sent.
 * If an invalid phone is provided, and error is returned. The error will later indicate the client
 * Not to continue to the code verification phase
 */
exports.sendCode = (phone, countryCode) => twilioApi(phoneVerification.verification_start, phone, countryCode)

/**
 * Verifying phone:
 * ----------------
 * Currently, the API requires you to pass phone+countryCode again, to verify.
 * A successful result returns a UUID, which can be saved in the database as the ID
 * of userVerification, alongside his phone number and country code.
 * The UUID will be passed as a token to the client
 * Later, during `verifyCode`, the client will send the UUID and the code, and we can fetch phone+countryCode
 * using the UUID.
 * sendCode -> save UUID + phone number in DB and return UUID -> verifyCode -> retreive phone number with UUID and verify
 * 
 * Handling user error:
 * --------------------
 * 
 * Entering the wrong code does not re-send a verification code.
 * Consider adding a `resend code` option (which will call `sendCode`),
 * For cases where an SMS is not sent (due to service error and etc)
 */
exports.verifyCode = (phone, countryCode, code) => twilioApi(phoneVerification.verification_check, phone, countryCode, code)
