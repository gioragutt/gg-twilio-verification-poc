const {Router} = require('express')
const bodyParser = require('body-parser')
const {createApiEndpoint: _} = require('lib/expressHelpers')
const api = require('app/api')

const router = new Router()

router.use(bodyParser.json())

router.post(
  '/verifyPhone',
  _(({body: {email, phone, countryCode}}) => {
    return api.sendCode(email, phone, countryCode)
  })
)

router.post(
  '/verifyCode',
  _(({body: {code}}) => {
    return api.verifyCode(code)
  })
)

module.exports = router
