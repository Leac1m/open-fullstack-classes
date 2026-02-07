const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer '))
    return authorization.replace('Bearer ', '')
  return null
}

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

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid'})
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  if (!newBlog.url) return response.status(400).json({error: "url missing"})
  if (!newBlog.title) return response.status(400).json({error: "title missing"})
    
  const blog = new Blog({...newBlog, author: user._id})

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
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