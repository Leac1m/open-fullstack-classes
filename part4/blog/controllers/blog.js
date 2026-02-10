const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { request } = require('express')


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

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
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

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid'})
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = await Blog.findById(request.params.id) 
  if (!blog) return response.status(404).end()
  
  if (blog.author.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'not authorized or not valid' })
  }
  
  const blogId = blog._id.toString()
  user.blogs = user.blogs.filter((userBlog) => userBlog._id.toString() !== blogId)
  await Blog.findByIdAndDelete(blogId)

  return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const whiteList = ["title", "author", "url", "likes"]
  const blogUpdate = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid'})
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = await Blog.findById(request.params.id) 
  if (!blog) return response.status(404).end()
  
  if (blog.author.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'not authorized or not valid' })
  }
  
  for (const field of whiteList) {
    if (blogUpdate[field]) {
      blog[field] = blogUpdate[field]
    }
  }
  
  await blog.save()
  response.json(blog)
})

module.exports = blogsRouter