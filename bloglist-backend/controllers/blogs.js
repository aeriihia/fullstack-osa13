const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  console.log(blogs.map(b => b.toJSON()))
  res.json(blogs)
})

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    console.log(blog.toJSON())
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  console.log(blog.toJSON())
  if (blog) {
    blog.likes = req.body.likes
    await blog.save()
    console.log(blog.toJSON())
    return res.json(blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  console.log(blog.toJSON())
  if (blog) {
    await blog.destroy()
  }
  res.status(204).end()
})

module.exports = router