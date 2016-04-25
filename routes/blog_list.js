var Tag = require('../models/tag')
var User = require('../models/user')

exports.show = function(req, res){
    var tags = []
    User.findOne({user_account:req.params.blogname}, function(err,user){
        Tag.find({tag_user:user._id}, function(err, tag){
            res.render('blog_list',{
                tags: tag,
                blogger: req.params.blogname
            })
        })
    })

}

exports.create = function(req,res){
    var new_tag = new Tag({
        tag_user: req.session.uid,
        tag_name: req.body.name
    })
    User.findById(req.session.uid,function(err, user){
        user.user_tag.push(new_tag._id);
        user.save(function(err) {console.log(err)})
    })
    new_tag.save(function(err) {console.log(err)})
    res.end()
}