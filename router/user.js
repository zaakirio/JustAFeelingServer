/*
HTTP POST /users — Register users.
HTTP POST /users/login — Allow users to login.
HTTP GET / users/me — Get user profile.
HTTP POST /users/logout —Logout the user
HTTP POST /users/logoutall — Logout from all device
*/

const express = require('express')
const User = require('../models/User')
const auth = require('../middlewares/auth')

const router = express.Router()

//View currently logged in user profile
router.get('/users/me', auth, async(req, res) => {
  res.send(req.user)
  console.log(error)
})

//Create a new user
router.post('/users', async(req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

//Login a registered user
router.post('/users/login', async(req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findByCredentials(username, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
      console.log(error)
        res.status(400).send(error)
    }

})

//Log user out of the application
router.post('/users/me/logout', auth, async (req, res) => {
  try {
      req.user.tokens = req.user.tokens.filter((token) => {
          return token.token != req.token
      })
      await req.user.save()
      res.send()
  } catch (error) {
      console.log(error)
      res.status(500).send(error)
  }
})


//Log user out of all devices
router.post('/users/me/logoutall', auth, async(req, res) => {
  try {
      req.user.tokens.splice(0, req.user.tokens.length)
      await req.user.save()
      res.send()
  } catch (error) {
      console.log(error)
      res.status(500).send(error)
  }
})

module.exports = router
