var User = require('../models/user')
var Tag = require('../models/tag')
var Blog = require('../models/blog')



exports.show = function(req, res) {
    if(req.session.uid) {
        Tag.find({tag_user:req.session.uid}, function(err, tag){
            var show_name = [];
            var show_number = []
            if(tag) {
                for(var i = 0; i < tag.length; i++) {
                    show_name[i] = tag[i].tag_name,
                    show_number[i] = tag[i].tag_number
                }
            }
            res.render('write',{
                show_name: show_name,
                show_number: show_number,
                blogger: req.session.account
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
        var img_url = 'images/blog/' + req.session.uid ;
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    // 客户端发起其它请求
    else if (req.query.action === 'config') {
        res.setHeader('Content-Type', 'application/json');
        // 这里填写 ueditor.config.json 这个文件的路径
        res.redirect('/ueditor/config.json')
    }

    if(!req.query.action) {
        User.findById(req.session.uid,function(err,user){
            console.log(user)
            var new_blog = new Blog({
                blog_title: req.body.title,
                blog_content: req.body.blog,
                blog_summary: req.body.txt,
                blog_tag: req.body.tag,
                blog_user: user._id,
                blog_time: Date.now() + (8 * 60 * 60 * 1000)
            })
            user.user_blog.push(new_blog)
            new_blog.save()
            user.save(function(err){if(err){console.log(err)}});
            res.redirect('/login')
        })
    }
}

exports.getTag = function(req, res) {
    Tag.find({tag_user:req.session.uid}, function(err,tag){
        var tag_name_box = [];
        var tag_number_box = [];
        var get_tag
        if(tag) {
            for(var i = 0; i < tag.length; i++) {
                tag_name_box.push(tag[i].tag_name)
                tag_number_box.push(tag[i].tag_number)
            }
            get_tag = {tag_name:tag_name_box, tag_number:tag_number_box};
            res.send(get_tag)
        }
    })
}