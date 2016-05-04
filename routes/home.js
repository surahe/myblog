var User = require('../models/user')
var Blog = require('../models/blog')
var Tag = require('../models/tag')

exports.show = function(req, res){
    User.findOne({user_account: req.params.blogname}, function(err, user) {
        Blog.find({blog_user:user._id}).populate('blog_tag').exec(function (err, blog){
            res.render('home',{
                blog: blog,
                bloggername: user.user_username,
                blogname: req.params.blogname,
                logo: user.user_logo
            })
        })
    })
}