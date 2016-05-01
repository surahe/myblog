var User = require('../models/user');
var Tag = require('../models/tag')
var Blog = require('../models/blog');

exports.show = function(req, res){
    Tag.find({tag_user:req.session.uid}, function(err, tag){
        var show_name = [];
        var show_number = []
        if(tag) {
            for(var i = 0; i < tag.length; i++) {
                show_name[i] = tag[i].tag_name,
                show_number[i] = tag[i].tag_number
            }
        }
        Blog.findById(req.params.blogid,function(err, blog){
            res.render('edit',{
                show_name: show_name,
                show_number: show_number,
                blogger: req.session.account,
                blog_title: blog.blog_title,
                blog_content: blog.blog_content
            })
        })
    })
}