const {Router} = require('express')
const {createApiEndpoint: _} = require('lib/expressHelpers')
const api = require('app/api')

const router = new Router()

router.post(
  '/sendCode',
  _(({body: {phone, countryCode}}) => {
    return api.sendCode(phone, countryCode)
  })
)

router.post(
  '/verifyCode',
  _(({body: {phone, countryCode, code}}) => {
    return api.verifyCode(phone, countryCode, code)
  })
)

module.exports = router
