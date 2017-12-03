const {AUTHY_AUTH_KEY} = require('./config')

const authy = require('authy')(AUTHY_AUTH_KEY)

// this should be saved in the DB, as a field in userRegistration
// see reference: https://www.twilio.com/docs/tutorials/account-verification-node-express#sending-a-verification-token
// -------------------
let authyId = null
// -------------------

const promisify = (instance, fn, ...args) => new Promise((resolve, reject) => fn.apply(instance, [...args, (err, result) => {
  if (err) {
    reject(err)
  }
  resolve(result)
}]))

const requestSms = async (id) => {
  try {
    return await promisify(authy, authy.request_sms, id, true)
  } catch (e) {
    console.log('Failed to request an sms')
    throw e
  }
}

exports.sendCode = async (email, phone, countryCode) => {
  try {
    // See reference: https://www.twilio.com/docs/api/authy/rest/users#enabling-new-user
    // The user's email address is used to register the user to authy.
    // A user can enter several email addresses with the same phone+countryCode
    // the same authyId will be returned for a phone+countryCode combo, regardless of the email specified
    // -------------------
    const {user: {id}} = await promisify(authy, authy.register_user, email, phone, countryCode)
    // -------------------

    // the api call returns the ID that is used in the verification, as stated above, should be saved in the DB
    // -------------------
    authyId = id
    // -------------------

    // the same ID is now used to send the SMS
    // -------------------
    const {cellphone} = await requestSms(authyId)
    // -------------------

    return {message: `SMS was sent to ${cellphone}`}
  } catch (e) {
    console.error('Caught exception', e)
    authyId = null
    throw e
  }
}

exports.verifyCode = async (code) => {
  try {
    console.log(code)

    // authyId should be retreived from the DB here
    // -------------------
    const verify = await promisify(authy, authy.verify, authyId, code)
    // -------------------

    console.log(verify)
    return {message: `Successfully verified phone!`}
  } catch (e) {
    console.log('Failed to verify code', e)
    throw e
  }
}