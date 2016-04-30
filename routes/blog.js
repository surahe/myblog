var User = require('../models/user');
var Blog = require('../models/blog');
exports.show = function(req, res) {
    User.findOne({user_account: req.params.blogname}, function(err, user){
        Blog.findById(req.params.blogid, function(err, blog){
            res.render('blog',{
                blogname: req.params.blogname,
                bloggername: user.user_username,
                logo: user.user_logo,
                blog_content: blog.blog_content,
                blog_title :blog.blog_title,
                blog_time: blog.blog_time
            })
        })
    })
}