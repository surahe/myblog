var User = require('../models/user')
var Blog = require('../models/blog')
var Tag = require('../models/tag')

exports.show = function(req, res){
    User.findOne({user_account: req.params.blogname}, function(err, user) {
        Blog.find({blog_user:user._id}, function(err, blog){
            var tag_box = [];
            for(var i = 0; i < blog.length; i++) {
                Tag.findOne({tag_user: user._id, tag_number: blog[i].blog_tag}, function(err, tag) {
                    if(!tag){
                        tag_box.push('默认分类')
                    }else{
                        tag_box.push(tag.tag_name);
                    }
                    if(tag_box.length == blog.length) {
                        res.render('home',{
                            blog: blog,
                            bloggername: user.user_username,
                            blogname: req.params.blogname,
                            logo: user.user_logo,
                            tag_box: tag_box
                        })
                    }
                })
            }
        })
    })
}