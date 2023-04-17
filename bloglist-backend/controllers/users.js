const router = require('express').Router()
require('express-async-errors')

const { User } = require('../models')

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error) {
    return res.status(400).send({ "error": [ "Validation isEmail on username failed" ] })
  }

  next(error)
}

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } })
  if (user) {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.use(errorHandler)

module.exports = router