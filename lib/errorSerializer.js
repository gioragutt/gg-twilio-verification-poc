const {assignWith} = require('lodash')

const assignWithCostumizer = (objValue, srcValue) => (objValue === undefined ? srcValue : objValue)

const errSerializer = err =>
  assignWith(
    {
      type: err.constructor.name,
      message: err.message,
      stack: err.stack,
    },
    err,
    assignWithCostumizer
  )

module.exports = errSerializer
