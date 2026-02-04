const blogsRouter = require('express').Router()
const { request, response } = require('../app')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})  
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    if (blog) response.json(blog)
    else response.status(404).end()
})

blogsRouter.post('/', async (request, response) => {
  const newBlog = { ...request.body, likes: request.body.likes ?? 0 }

  if (!newBlog.url) return response.status(400).json({error: "url missing"})
  if (!newBlog.title) return response.status(400).json({error: "title missing"})
    
  const blog = new Blog(newBlog)

  await blog.save()
  response.status(201).json(blog)
})

blogsRouter.put('/:id', async (request, response) => {
  const whiteList = ["title", "author", "url", "likes"]
  const blogUpdate = request.body

  const blog = await Blog.findById(request.params.id) 
  if (!blog) return response.status(404).end()
  
  for (const field of whiteList) {
    if (blogUpdate[field]) {
      blog[field] = blogUpdate[field]
    }
  }
  
  await blog.save()
  response.json(blog)
})

module.exports = blogsRouter