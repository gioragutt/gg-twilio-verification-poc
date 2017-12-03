const {AUTHY_AUTH_KEY} = require('./config')

const authy = require('authy')(AUTHY_AUTH_KEY)

let authyId = null

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
    const {user: {id}} = await promisify(authy, authy.register_user, email, phone, countryCode)
    authyId = id
    const {cellphone, message} = await requestSms(authyId)
    return {
      message: `SMS was sent to ${cellphone}`
    }
  } catch (e) {
    console.error('Caught exception', e)
    authyId = null
    throw e
  }
}

exports.verifyCode = async (code) => {
  try {
    console.log(code)
    const verify = await promisify(authy, authy.verify, authyId, code)
    console.log(verify)
    return {
      message: `Successfully verified phone!`
    }
  } catch (e) {
    console.log('Failed to verify code', e)
    throw e
  }
}