require('app-module-path').addPath(__dirname)

const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const apiRouter = require('app/router')
const {PORT} = require('app/config')
const {errorHandler} = require('lib/expressHelpers')
const {logger, expressLogger} = require('lib/logger')

const app = express()

app.use(bodyParser.json())
app.use(expressLogger)
app.use(errorHandler)
app.use('/api/v1', apiRouter)
app.use(express.static(path.resolve(__dirname, '../dist')))

const server = app.listen(PORT, () => logger.info({binding: server.address()}, 'Server started'))