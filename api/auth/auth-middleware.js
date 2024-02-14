
async function protect(req, res, next) {
    if(req.session.user){
        next()
    } else {
        next({ status: 401, message: 'You Shall NOT PASS!' })
    }
}

//to delete the Cookie by hand, go to Application tab inside the chrome dev console, highlight the cookie and press the x. This effectively takes it off and gives the message you shall not pass at the bottom of the screen instead of the users

//DONE!


module.exports = {
    protect
}
