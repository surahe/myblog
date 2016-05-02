var User = require('../models/user');
var Blog = require('../models/blog');
var Tag = require('../models/tag');
exports.show = function(req, res) {
    User.findOne({user_account: req.params.blogname}, function(err, user){
        Blog.findById(req.params.blogid, function(err, blog){
            if(blog.blog_tag == '00') {
                res.render('blog',{
                    blogname: req.params.blogname,
                    bloggername: user.user_username,
                    logo: user.user_logo,
                    blog_content: blog.blog_content,
                    blog_title :blog.blog_title,
                    blog_time: blog.blog_time,
                    blog_id: blog._id,
                    blog_tag: '00',
                    blog_tagName: '默认分类'
                })
            }
            else {
                Tag.findOne({tag_user: user._id, tag_number: blog.blog_tag}, function(err, tag){
                    res.render('blog',{
                        blogname: req.params.blogname,
                        bloggername: user.user_username,
                        logo: user.user_logo,
                        blog_content: blog.blog_content,
                        blog_title :blog.blog_title,
                        blog_time: blog.blog_time,
                        blog_id: blog._id,
                        blog_tag:  tag.tag_number,
                        blog_tagName: tag.tag_name
                    })
                })
            }
        })
    })
}