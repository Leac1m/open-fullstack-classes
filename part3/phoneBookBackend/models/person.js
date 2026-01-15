const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

console.log('conecting to', url)
mongoose.connect(url, {family: 4})
.then(() => console.log('connected to Mongodb'))
.catch((error => console.log('error connecting to MongoDB:', error.message)))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id
    delete returnObject._id
    delete returnObject.__v
  }
})

module.exports = mongoose.model('Note', personSchema)