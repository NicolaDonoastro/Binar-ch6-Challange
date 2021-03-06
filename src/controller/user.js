const db = require('../models')

const userController = {
  getUsers: async (req, res) => {
    try {
      const users = await db.User.findAll({})

      res.render('dashboard', { users })
    } catch (err) {
      res.send(err).status(400)
    }
  },

  getUser: async (req, res) => {
    const { id } = req.params

    try {
      const user = await db.User.findOne({
        where: { id },
        include: [db.Bio, db.Histories],
      })

      const { Histories, Bio } = user

      res.render('profile', { user, Histories, Bio })
    } catch (err) {
      res.status(400).send({ error: 'user not found' })
    }
  },

  getAddUser: async (req, res) => {
    res.render('create')
  },

  postAddUser: async (req, res) => {
    const {
      name,
      username,
      email,
      age,
      address,
      phoneNumber,
      school,
      steamLevel,
    } = req.body

    const userBody = {
      name,
      username,
      email,
      age,
      Bio: [
        {
          address,
          phoneNumber,
          school,
          steamLevel,
        },
      ],
    }

    console.log(userBody)

    try {
      const user = await db.User.create(userBody, { include: [db.Bio] })

      res.status(200).redirect('/users/')
    } catch (err) {
      res.send(err).status(400)
    }
  },

  getUpdateUser: async (req, res) => {
    const { id } = req.params

    try {
      const user = await db.User.findOne({ where: { id }, include: [db.Bio] })

      const { Bio } = user

      res.status(200).render('update', { user, Bio })
    } catch (err) {
      res.send(err).status(400)
    }
  },

  postUpdateUser: async (req, res) => {
    const {
      body: {
        name,
        username,
        email,
        age,
        address,
        phoneNumber,
        school,
        steamLevel,
      },
      params: { id },
    } = req

    const userBody = {
      name,
      username,
      email,
      age,
    }

    const bioBody = {
      address,
      phoneNumber,
      school,
      steamLevel,
    }

    try {
      const user = await db.User.update(userBody, { where: { id } })

      const bio = await db.Bio.update(bioBody, { where: { userId: id } })

      res.redirect('/users/')
    } catch (err) {
      res.send(err).status(400)
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params

    try {
      const user = await db.User.destroy({ where: { id } })

      res.redirect('/users').status(200)
    } catch (err) {
      res.send(err).status(400)
    }
  },
}

module.exports = userController
