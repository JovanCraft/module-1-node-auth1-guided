const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../users/users-model')
const router = express.Router()


router.post('/register', async (req, res, next) => {
    try {
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 8)//8 means it will be done 2 to the 8th power(2 ^ 8)!!!
    const newUser = { username, password: hash }
    const result = await User.add(newUser)
    res.status(201).json({
        message: `nice to have you on, ${result.username}`
    })
    } catch(err) {
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    res.json({ message: 'login working!' })
})

router.get('/logout', async (req, res, next) => {
    res.json({ message: 'logout working!' })
})



module.exports = router
