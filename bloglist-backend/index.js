const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

Blog.sync()

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  console.log(blogs.map(b => b.toJSON()))
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    console.log(blog.toJSON())
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
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

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})