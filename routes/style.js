var User = require('../models/user');

exports.form = function(req, res) {
    if(! req.session.uid) {
        res.redirect('/login');
    } else {
        User.findById(req.session.uid, function(err, user) {
            res.render('style', {
                blogname: user.user_account,
                bloggername: user.user_username,
                style: user.user_style
            })
        })
    }
}

exports.submit = function(req, res){
    User.findById(req.session.uid, function(err, user){
        user.user_style = req.body.style;
        user.save()
        res.end()
    })
}