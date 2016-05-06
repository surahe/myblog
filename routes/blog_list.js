var Tag = require('../models/tag')
var User = require('../models/user')
var Blog = require('../models/blog')

exports.show = function(req, res){
    var blogtag = req.params.tagnumber; //当前页面的标签编号
    var page = req.page;
    User.findOne({user_account:req.params.blogname}, function(err,user){
        //查询该博主的tag
        Tag.find({tag_user:user._id},null,{sort:{_id:1}}, function(err, tag){
            Tag.find({tag_user:user._id},'tag_amount -_id', function(err, tag_amo){
                Blog.find({blog_user:user._id}, function(err, blognumber){
                    //将默认分类的日志数存储到df_count
                    Blog.find({blog_user:user._id, blog_tag: "00"}, function(err, data){
                        //若blogtag undefined，访问所有日志
                        if(!blogtag) {
                            Blog.find({blog_user:user._id},null,{skip: page.from, limit: page.to-page.from+1,sort:{_id:-1}}, function(err, all){
                                res.render('blog_list',{
                                    tags: tag,
                                    blogger: req.params.blogname,
                                    bloggername: user.user_username,
                                    blog_count: blognumber.length,
                                    blog_list: all,
                                    tag_name: "所有日志",
                                    tag_number: tag_amo,
                                    all_number: blognumber.length,
                                    style: user.user_style
                                })
                            })
                        }
                        //否则显示该分类的日志
                        else {
                            Tag.findOne({tag_user:user._id,tag_number:blogtag },function(err, nowtag){
                                Tag.find({tag_user:user._id},'tag_amount -_id',{skip: page.from, limit: page.to-page.from+1,sort:{_id:-1}}, function(err, tag_amo) {
                                    Blog.find({blog_user:user._id, blog_tag:nowtag._id}, function(err, part){
                                        res.render('blog_list',{
                                            tags: tag,
                                            blogger: req.params.blogname,
                                            bloggername: user.user_username,
                                            blog_count: part.length,
                                            blog_list: part,
                                            tag_name: nowtag.tag_name,
                                            tag_number: tag_amo,
                                            all_number: blognumber.length,
                                            style: user.user_style
                                        })
                                    })
                                })
                            })
                        }
                    })
                })
            })
        })
    })
}


//创建标签
exports.create = function(req,res){
    var taglength = 0;
    var tagnumber = []; //创建前所有标签编号
    var empty = []      //漏掉的编号
    var new_tag;        //新标签
    Tag.find({tag_user:req.session.uid}, function(err, tag){
        taglength = tag.length;
        //排序函数
        function sortNumber(a,b) {
            return a - b
        }
        //如果创建前已经有标签
        if(tag) {
            //将原始的标签编号存放到tagnumber
            for(var i in tag) {
                tagnumber.push(parseInt(tag[i].tag_number))
            }
            tagnumber.sort(sortNumber)
            //如果排序后第一个元素不是0，把前面的编号存放到empty
            if(tagnumber[0]!=0){
                for(var i=0; i < tagnumber[0];i++){
                    empty.push(i)
                }
            }
            //把中间漏掉的编号存放到empty
            for(var i= 0; i< tagnumber.length;i++){
                if( i+1<tagnumber.length && tagnumber[i+1] -  tagnumber[i] >= 2){
                    for(var j = 1; j < tagnumber[i+1] - tagnumber[i]; j++){
                        empty.push(tagnumber[i]+j)
                    }
                }
            }
        }
        //若有漏掉的元素，标签编号为第一个empty元素
        if(empty.length) {
            new_tag = new Tag({
                tag_user: req.session.uid,
                tag_name: req.body.name,
                tag_number: empty[0],
                tag_amount: 0
            })
        }
        //否则为taglengh长度
        else {
            new_tag = new Tag({
                tag_user: req.session.uid,
                tag_name: req.body.name,
                tag_number: taglength,
                tag_amount: 0
            })
        }
        new_tag.save(function(err) {console.log(err)})
        User.findById(req.session.uid,function(err, user){
            user.save(function(err) {console.log(err)})
            res.end()
        })
    })

}

//删除标签
exports.del = function(req, res){
    //被删除的分类
    Tag.findOne({tag_user:req.session.uid, tag_name:req.body.name}, function(err, tag){
        //查询默认分类
        Tag.findOne({tag_user:req.session.uid, tag_number:'00'}, function(err, def) {
            //将日志的分类设置为默认分类的id
            Blog.update({blog_tag:tag._id},{$set:{blog_tag:def._id}},{ multi: true },function(err3, blog){
                //删除分类，默认分类增加数量
                Tag.findOneAndRemove({tag_user:req.session.uid, tag_name:req.body.name},function(err,tag){
                    def.tag_amount = def.tag_amount + blog.n;
                    def.save()
                    if(err){console.log(err)}
                    res.end()
                })
            } )
        })
    })

}


//编辑标签
exports.edit = function(req, res) {
    Tag.findOneAndUpdate({tag_user:req.session.uid, tag_name:req.body.oldname},{tag_name:req.body.newname},{new:true},function(err, tag){
        if(err){console.log(err)}
        res.end()
    })
}

//删除日志
exports.del_blog = function(req, res) {
    Blog.findByIdAndRemove(req.body.id, function(err,blog){
        if(err){console.log(err)}
        Tag.findById(blog.blog_tag, function(err, tag){
            tag.tag_amount--;
            tag.save()
            res.end()
        })
    })
}