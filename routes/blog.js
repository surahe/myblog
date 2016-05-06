var User = require('../models/user');
var Blog = require('../models/blog');
var Tag = require('../models/tag');
var Message = require('../models/message');

exports.show = function(req, res) {
    var page = req.page;
    User.findOne({user_account: req.params.blogname}, function(err, user){
        Blog.findById(req.params.blogid, function(err, blog){
            Tag.findById(blog.blog_tag, function(err, tag){
                Message.find({message_blog:blog._id}, null, {skip: page.from, limit: page.to-page.from+1,sort:{_id:-1}}).populate('message_user').exec(function(err, msg){
                    console.log(blog)
                    res.render('blog',{
                        blogname: req.params.blogname,
                        bloggername: user.user_username,
                        logo: user.user_logo,
                        blog_content: blog.blog_content,
                        blog_title :blog.blog_title,
                        blog_time: blog.blog_time,
                        blog_id: blog._id,
                        blog_tag:  tag.tag_number,
                        blog_tagName: tag.tag_name,
                        blog_msg: msg,
                        style: user.user_style
                    })
                })
            })
        })
    })
}

exports.post = function(req, res) {
    var msg = new Message({
        message_user: req.session.uid,
        message_content: req.body.message,
        message_time: Date.now(),
        message_blog: req.body.blogid,
    })
    msg.save(function(err){
        console.log(err)
    })
    res.end()
}

exports.del_msg = function(req, res) {
    Message.findByIdAndRemove(req.body.id, function(err, msg){
        if(err){console.log(err)};
        res.end()
    })
}