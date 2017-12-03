const HttpError = require('standard-http-error')

const createApiEndpoint = fn => (req, res, next) => {
  fn(req)
    .then(result => res.send(result))
    .catch(error => next(error))
}

const errorHandler = (err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  req.log.error({err, req, res}, err.message)
  const status = err.httpErrorCode || err.status || (err instanceof HttpError && err.code) || 500
  res.status(status).send({
    message: err.message,
    stack: (err.stack || '').replace(stackFileRegex, ''),
  })
}

module.exports = {
  errorHandler,
  createApiEndpoint
}