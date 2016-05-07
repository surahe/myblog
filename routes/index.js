var User = require('../models/user')
var Blog = require('../models/blog')

exports.show = function(req, res){
    User.find({},null,{limit: 6}, function(err, user){
        Blog.find({}, null,{sort:{'_id':-1}, limit: 4}).populate('blog_user').exec(function(err, blog){
            res.render('index',{
                new_blog: blog,
                new_user: user
            })
        })
    })
}