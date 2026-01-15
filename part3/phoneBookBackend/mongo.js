const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
}

const password = process.argv[2]

const url = 'mongodb://localhost:27017/Person_v1'

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', PersonSchema)

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  console.log(`name: ${name}, number: ${number}`)
  
  const person = new Person({
    name,
    number
  })

  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('phonebook;')
  
  Person.find({}).then(persons => {
    persons.forEach(person => console.log(`${person.name} ${person.number}`))
    mongoose.connection.close()    
  })
}
