const express = require('express')
const morgan = require('morgan')
const config = require('./utils/config')
const logger = require('./utils/logger')

const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => response.json(person)).catch(() => response.status(404).end())
  })

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) return response.status(400).json({ error: 'name missing'})
  
  if (!body.number) return response.status(400).json({ error: 'number missing'})

  const nameExists = persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())
  if (nameExists) return response.status(409).json({ error: 'name must be unique' })
  
  const person = {
    name: body.name,
    number: body.number
  }

  person.save().then(savedPerson => {
    response.json(savedPerson).status(201)
  })
})

app.get('/info', (request, response) => {
  const personCount = Person.length
  const date = new Date()

  return response.send(`<p>Phonebook has info for ${personCount} people</p><p>${date}</p>`)
})


app.listen(PORT)
logger.info(`Server running on port ${config.PORT}`)