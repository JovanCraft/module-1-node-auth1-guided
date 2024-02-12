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
    try {
        const { username, password } = req.body
        const [user] = await User.findBy({ username })
        if(user && bcrypt.compareSync(password, user.password)){
            //start session
            req.session.user = user//important line!! it signals to the express-session library that a session needs to be saved for this user and a cookie needs to be set on the browser
            res.json({ message: `welcome back, ${user.username}` })
        } else {
            next({ status: 401, message: 'bad credentials' })
        }
    } catch(err) {
        next(err)
    }
})

router.get('/logout', async (req, res, next) => {
    res.json({ message: 'logout working!' })
})



module.exports = router
