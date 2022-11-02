const User = require('../models/User')
module.exports = (req, res) => {
    User.create(req.body, (error, user) => {
        if (error) {
            return res.render('error', { error })
        }
        res.redirect('/')
    })

}