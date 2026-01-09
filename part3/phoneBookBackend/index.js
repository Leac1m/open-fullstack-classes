const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  return response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if (!person) return response.status(404).end()

  return response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) return response.status(400).json({ error: 'name missing'})
  
  if (!body.number) return response.status(400).json({ error: 'number missing'})

  const nameExists = persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())
  if (nameExists) return response.status(409).json({ error: 'name must be unique' })
  
  const id = generatedId()
  const person = {
    id,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.status(201).json(person).end()
})

app.get('/info', (request, response) => {
  const personCount = persons.length
  const date = new Date()

  return response.send(`<p>Phonebook has info for ${personCount} people</p><p>${date}</p>`)
})

const generatedId = () => {
  const maxId = () => Math.max(...persons.map(p => Number(p.id)))

  return String(maxId() + 1)
}

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)