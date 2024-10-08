const path = require('path')
const express = require('express')
const session = require('express-session')
const Store = require('connect-session-knex')(session)
const authRouter = require('./auth/auth-router.js')
const usersRouter = require('./users/users-router.js')

const server = express()

server.use(express.static(path.join(__dirname, '../client')))
server.use(express.json())
server.use(session({
  name: 'monkey', //unique session id that is different from the user(the same user id my have several different sessions) DEFAULT IS: sid
  secret: 'keep it secret, keep it safe!',//secret string due to it being encrypted; used to encrypt and decrypt the cookie/varify that the cookie is valid for each session
  cookie: {
    maxAge: 1000 * 60 * 60, //so it will be perishable(is done in milliseconds!!) ONE DAY IN MILLISECONDS WOULD BE: 1 * 24 * 60 * 60 * 1000
    secure: false, //true would mean that cookie can ONLY work with https, not http; this should be TRUE in production
    httpOnly: false //http can NOT be accessed by JavaScript so this, setting it to false means the JavaScript CAN READ THE COOKIE; always neds to be set to true in production
  },
  rolling: true,//setting it to true makes sure you get a fresh cookie with every login(Set-Cookie on the reponse header should pop up in Network tab)
  resave: false,//forces the session to be saved back to the session store, even if the session wasn't modified during the request
  saveUninitialized: false, //setting it to false means we can only set a cookie on successful login, reducing server usage!! Should only be true when the user has opted in to let us save cookies: There are laws against setting cookies automatically
  store: new Store({
    knex: require('../database/db-config.js'),//gives the store direct access to the database
    tablename: 'sessions',//the default is sessions already
    sidfieldname: 'sid', //the deault name is already sessions id (sid)
    createtable: true, //means if there is NO sessions table in the database, the library will go ahead and create it. createtable should NOT be camel cased
    clearInterval: 1000 * 60 * 60,//clearInterval is the only one of these that SHOULD BE CAMEL CASED. its suppose to make sure there is clean up done every now and then to remove old sesions from the database to keep it clean and performant. ALSO EXPRESSED IN MILLISECONDS
  })
}))

server.use('/api/auth', authRouter)
server.use('/api/users', usersRouter)

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

server.use('*', (req, res, next) => {
  next({ status: 404, message: 'not found!' })
})

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = server
