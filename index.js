require('app-module-path').addPath(__dirname)

const path = require('path')
const express = require('express')
const apiRouter = require('app/router')
const {PORT} = require('app/config')
const {errorHandler} = require('lib/expressHelpers')

const app = express()

app.use(errorHandler)
app.use('/api/v1', apiRouter)
app.use(express.static(path.resolve(__dirname, '../dist')))
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))