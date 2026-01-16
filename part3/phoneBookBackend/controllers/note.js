const notesRouter = require('express').Router()
const { request } = require('express')
const Note = require('../models/note')
const { error } = require('../utils/logger')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  
  const note = new Note({
    content: body.content,
    important: body.important || false 
  })

  note.save()
  .then(savedNote => {
    response.json(savedNote)
  })
  .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  Note.findById(request.params.id)
  .then(note => {
    if (!note) {
      return response.status(404).end()
    }

    note.content = body.content
    note.important = body.important

    note.save()
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })
  .catch(error => next(error))
})

module.exports = notesRouter