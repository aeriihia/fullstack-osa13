const router = require('express').Router()
const jwt = require('jsonwebtoken')
require('express-async-errors')
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error) {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

router.get('/', async (req, res) => {

  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        },
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    order: [
      ['likes', 'DESC'],
    ],
    include: {
      model: User
    },
    where
  })
  res.json(blogs)
})

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      console.log(SECRET)
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({...req.body, userId: user.id})
  res.json(blog)
})

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (user && user.id === req.blog.userId) {
    await req.blog.destroy()
    res.status(204).end()
  }
})

router.use(errorHandler)

module.exports = router