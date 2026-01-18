const express = require('express')

const blogsRouter = require('./controllers/blog')
const app = express()

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
