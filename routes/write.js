var User = require('../models/user')
var Tag = require('../models/tag')
var Blog = require('../models/blog')



exports.show = function(req, res) {
    if(req.session.uid) {
        User.findById(req.session.uid, function(err, user) {
            Tag.find({tag_user: req.session.uid}, function (err, tag) {
                var show_name = [];
                var show_number = []
                if (tag) {
                    for (var i = 0; i < tag.length; i++) {
                        show_name[i] = tag[i].tag_name,
                            show_number[i] = tag[i].tag_number
                    }
                }
                res.render('write', {
                    show_name: show_name,
                    show_number: show_number,
                    blogger: req.session.account,
                    style: user.user_style
                })
            })
        })
    } else{
        res.redirect('/login')
    }
}

exports.submit =  function(req, res, next) {
    // ueditor 客户发起上传图片请求
    if(req.query.action === 'uploadimage'){
        // 这里你可以获得上传图片的信息
        var foo = req.ueditor;
        //console.log(foo.filename); // exp.png
        //console.log(foo.encoding); // 7bit
        //console.log(foo.mimetype); // image/png
        // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
        var img_url = 'images/blog/' + req.session.uid;
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    // 客户端发起其它请求
    else if (req.query.action === 'config') {
        res.setHeader('Content-Type', 'application/json');
        // 这里填写 ueditor.config.json 这个文件的路径
        res.redirect('/ueditor/config.json')
    }

    if(!req.query.action) {
        Blog.findById(req.body.id,function(err, blog){
            //新日志
            if(! blog) {
                User.findById(req.session.uid,function(err,user){
                    Tag.findOne({tag_user:req.session.uid, tag_number:req.body.tag}, function(err, tag){
                        tag.tag_amount++;
                        tag.save()
                        var txt = req.body.txt.substr(0,150)
                        var new_blog = new Blog({
                            blog_title: req.body.title,
                            blog_content: req.body.blog,
                            blog_summary: txt,
                            blog_tag: tag._id,
                            blog_user: user._id,
                            blog_time: Date.now(),
                        })
                        new_blog.save()
                        user.save(function(err){if(err){console.log(err)}});
                        res.redirect('http://localhost:3000/' + user.user_account + '/bloglist/')
                    })
                })
            } else {
                var txt = req.body.txt.substr(0,150);
                Tag.findById(blog.blog_tag, function(err, old){
                    old.tag_amount --;
                    old.save()
                    Tag.findOne({tag_user:req.session.uid, tag_number:req.body.tag}, function(err, tag) {
                        tag.tag_amount++;
                        blog.set({
                            blog_title: req.body.title,
                            blog_content: req.body.blog,
                            blog_summary: txt,
                            blog_tag: tag._id
                        })
                        tag.save()
                        blog.save()
                    })
                })
                User.findById(req.session.uid,function(err,user){
                    res.redirect('http://localhost:3000/' + user.user_account + '/blog/' + req.body.id)
                })
            }
        })
    }
}
