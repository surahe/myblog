var Tag = require('../models/tag')
var User = require('../models/user')
var Blog = require('../models/blog')

exports.show = function(req, res){
    var tag_count = [];
    var blog_count = 0;
    var df_count = 0;
    User.findOne({user_account:req.params.blogname}, function(err,user){
        Tag.find({tag_user:user._id}, function(err, tag){
            for(var i = 0; i<tag.length; i++) {
                Blog.find({blog_tag:tag[i].tag_number,blog_user:user._id}, function(err, blog) {
                    tag_count.push(blog.length)
                })
            }
            Blog.find({blog_user:user._id}, function(err, blognumber){
                blog_count = blognumber.length;
                Blog.find({blog_user:user._id, blog_tag: "00"}, function(err, data){
                    df_count = data.length
                    res.render('blog_list',{
                        tags: tag,
                        blogger: req.params.blogname,
                        bloggername: user.user_username,
                        blog_count: blog_count,
                        tag_count: tag_count,
                        df_count: df_count
                    })
                })
            })
        })
    })
}

exports.create = function(req,res){
    var taglength = 0;
    var tagnumber = [];
    var empty = []
    var new_tag;
    Tag.find({tag_user:req.session.uid}, function(err, tag){
        taglength = tag.length;
        function sortNumber(a,b) {
            return a - b
        }
        if(tag) {
            for(var i in tag) {
                tagnumber.push(tag[i].tag_number)
            }
            tagnumber.sort(sortNumber)
            if(tagnumber[0]!=0){
                for(var i=0; i < tagnumber[0];i++){
                    empty.push(i)
                }
            }
            for(var i= 0; i< tagnumber.length;i++){
                if( i+1<tagnumber.length && tagnumber[i+1] -  tagnumber[i] >= 2){
                    for(var j = 1; j < tagnumber[i+1] - tagnumber[i]; j++){
                        empty.push(tagnumber[i]+j)
                    }
                }
            }
        }
        console.log(tagnumber)
        console.log(empty)
        if(empty.length) {
            new_tag = new Tag({
                tag_user: req.session.uid,
                tag_name: req.body.name,
                tag_number: empty[0]
            })
        }
        else {
            new_tag = new Tag({
                tag_user: req.session.uid,
                tag_name: req.body.name,
                tag_number: taglength
            })
        }
        new_tag.save(function(err) {console.log(err)})
        User.findById(req.session.uid,function(err, user){
            user.user_tag.push(new_tag._id);
            user.save(function(err) {console.log(err)})
            res.end()
        })
    })

}

exports.del = function(req, res){
    Tag.findOneAndRemove({tag_user:req.session.uid, tag_name:req.body.name},function(err,tag){
        if(err){console.log(err)}
        User.findByIdAndUpdate(req.session.uid, { $pull:{ user_tag: tag._id } },{new:true} ,function(err,data){
            if(err){console.log(err)}
            res.end()
        });
    })
}

exports.edit = function(req, res) {
    Tag.findOneAndUpdate({tag_user:req.session.uid, tag_name:req.body.oldname},{tag_name:req.body.newname},{new:true},function(err, tag){
        if(err){console.log(err)}
        res.end()
    })
}