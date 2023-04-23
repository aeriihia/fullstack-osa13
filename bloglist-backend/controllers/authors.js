const router = require('express').Router()
require('express-async-errors')
const { Sequelize } = require('sequelize')

const { Blog } = require('../models')

router.get('/', async (req, res) => {

  const authors = await Blog.findAll({
    group : 'author',
    attributes: ['author', [Sequelize.fn('count', Sequelize.col('url')), 'blogs'], [Sequelize.fn('sum', Sequelize.col('likes')), 'likes']],
    order: Sequelize.literal('likes DESC')
  })
  res.json(authors)
})

module.exports = router