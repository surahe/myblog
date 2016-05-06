var User = require('../models/user');
var Tag = require('../models/tag')
var Blog = require('../models/blog');

exports.show = function(req, res){
    User.findById(req.session.uid, function(err, user) {
        Tag.find({tag_user: req.session.uid}, function (err, tag) {
            Blog.findById(req.params.blogid, function (err, blog) {
                if (req.session.uid == blog.blog_user) {
                    res.render('edit', {
                        tag: tag,
                        blogger: req.session.account,
                        blog_title: blog.blog_title,
                        blog_content: blog.blog_content,
                        blog_tag: blog.blog_tag,
                        blog_id: blog.id,
                        style: user.user_style
                    })
                }
                else {
                    res.redirect('/login')
                }
            })
        })
    })
}