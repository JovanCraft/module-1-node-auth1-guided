const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../users/users-model')
const router = express.Router()


router.post('/register', async (req, res, next) => {
    try {
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 8)//8 means it will be done 2 to the 8th power(2 ^ 8)!!!
    const newUser = { username, password: hash }
    //password = hash
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

router.get('/logout', async (req, res, next) => { //eslint-disable-line
    if(req.session.user){
        const { username } = req.session.user
        req.session.destroy(err => {
            if(err){
                res.json({ message: `but you can never leave, ${username}` })
            } else {
                res.set('Set-Cookie', 'monkey=; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00') //by setting a cookie maually with a date that is in the past, compliant browsers will remove the cookie on logout and the session will be destroyed in the server
                res.json({ message: `Goodbye, ${username}` })
            }
        })
    } else {
        res.json({ message: `sorry, have we met before?? I don't know you!`})
    }
})

//if you login in and working it as normal(fetch users)and go in to the terminal with the server running in it, when you type rs to start the server and THEN try to fetch users, you get the you shall not pass message because the session was destroyed and the one that was provided (the fake) doesn't work!


module.exports = router
