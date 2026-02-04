const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blog')
const config = require('./utils/config')
const logger = require('./utils/logger')
const app = express()

const PORT = 3003
logger.info('connecting to', config.MONGODB_URI)
mongoose.set('strictQuery', false)

mongoose
  .connect(config.MONGODB_URI)
  .then((result) => {
    const PORT = 3003
logger.info('connected to MongoDB')
  })
  .catch((error) => {
    const PORT = 3003
logger.info('error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
