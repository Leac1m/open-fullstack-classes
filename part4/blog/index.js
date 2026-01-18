const app = require('./app')
const mongoose = require('mongoose')

const mongoUrl = 'mongodb://localhost/bloglist'
mongoose.connect(mongoUrl, { family: 4 })

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})