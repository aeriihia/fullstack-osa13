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

router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  console.log(blog.toJSON())
  if (blog) {
    try {
      await Blog.destroy({where:{id: req.params.id}})
      return res.status(200).json('OK')
    } catch (error) {
      return res.status(400).json({ error })
    }
  }
})

module.exports = router