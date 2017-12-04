const HttpError = require('standard-http-error')
const {escapeRegExp} = require('lodash')

const stackFileRegex = new RegExp(`${escapeRegExp(process.cwd())}`, 'ig')

const createApiEndpoint = fn => (req, res, next) => {
  fn(req)
    .then(result => res.send(result))
    .catch(error => next(error))
}

const errorHandler = (err, req, res, next) => {
  req.log.error({err, req, res}, err.message)
  const status = err.httpErrorCode || err.status || (err instanceof HttpError && err.code) || 500
  res.status(status).send({
    message: err.message,
    stack: err.stack ? err.stack.replace(stackFileRegex, '') : ''
  })
}

module.exports = {
  errorHandler,
  createApiEndpoint
}