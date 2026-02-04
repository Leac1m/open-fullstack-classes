const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const logger = require('../utils/logger')

const api = supertest(app)

describe('Blog endpoint tests', async () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    describe('blogs can be viewed', async () => {
        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })
        
        test('a specific blog can be viewed', async () => {
            const blogsAtStart = await helper.blogInDB()
            const blogToView = blogsAtStart[0]
        
            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)
        
            assert.deepStrictEqual(resultBlog.body, blogToView)
        })
    })

    describe('blogs list can be update', async () => {
        test('blog can be added', async () => {
            const newBlog = {
                title: "new title title",
                author: "unknown",
                url: "example.com",
                likes: 6
            }
        
            const result = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
                assert.strictEqual(result.body.title, newBlog.title)
                assert.strictEqual((await helper.blogInDB()).length, helper.initialBlogs.length + 1)
        })
        
        test('blog can be added, "likes" defaults to 0 if missing', async () => {
            const newBlog = {
                title: "new title title",
                author: "unknown",
                url: "example.com",
            }
        
            const result = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
                assert.strictEqual(result.body.likes, 0)
                assert.strictEqual((await helper.blogInDB()).length, helper.initialBlogs.length + 1)
        })
        
        test('blog can be added, returns bad request if "url" is missing ', async () => {
            const newBlog = {
                title: "new title title",
                author: "unknown",
            }
        
            const result = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
                .expect('Content-Type', /application\/json/)
            
                assert.strictEqual((await helper.blogInDB()).length, helper.initialBlogs.length)
        })
        
        test('blog can be added, returns bad request if "title" is missing ', async () => {
            const newBlog = {
                author: "unknown",
                url: "example.com",
            }
        
            const result = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
                .expect('Content-Type', /application\/json/)
            
                assert.strictEqual((await helper.blogInDB()).length, helper.initialBlogs.length)
        })
    })
    
    describe('a specific blog can updated', async () => {
        test('blog successfully updates', async () => {
            const blogsAtStart = await helper.blogInDB();
            const blogToUpdate = blogsAtStart[0]
            const newTitle = "A new Title"
            
            blogToUpdate.title = newTitle
            await api.put(`/api/blogs/${blogToUpdate.id}`)
                .send(blogToUpdate)
                .expect(200)
            
            const blogsAtEnd = await helper.blogInDB()
            assert.strictEqual(blogsAtEnd[0].title, newTitle)
        })

        test('a specific blog field can be upgraded', async () => {
            const blogsAtStart = await helper.blogInDB()
            const blogsToUpdate = blogsAtStart[0]

            const blogUpdate = { title: "only title is sent" }

            await api.put(`/api/blogs/${blogsToUpdate.id}`)
                .send(blogUpdate)
                .expect(200)
        
            const blogsAtEnd = await helper.blogInDB()
            assert.strictEqual(blogsAtEnd[0].title, blogUpdate.title)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})