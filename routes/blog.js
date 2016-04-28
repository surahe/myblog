var User = require('../models/user');
exports.show = function(req, res) {
    User.findOne({user_account: req.params.blogname}, function(err, user){
        res.render('blog',{
            blogname: req.params.blogname,
            bloggername: user.user_username,
            logo: user.user_logo,
        })
    })
}