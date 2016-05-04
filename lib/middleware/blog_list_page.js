var User = require('../../models/user');
var Blog = require('../../models/blog');

module.exports = function(req, res, next){
    var perpage =  5;
    //将参数page解析为十进制的整型值
    var page = Math.max(parseInt(req.param('page') || '1', 10), 1);
    //调用传入的函数
    User.findOne({user_account: req.params.blogname},function(err,data){
        Blog.count({blog_user: data._id},
            (function(err, total){
                if (err) return next(err);
                if(req.param('page') > Math.ceil(total / perpage)) page = Math.ceil(total / perpage);
                //保存page属性以便将来引用
                req.page = res.locals.page = {
                    number: page,
                    perpage: perpage,
                    from: (page-1) * perpage,
                    to: (page-1) * perpage + perpage - 1,
                    total: total,
                    count: Math.ceil(total / perpage)
                };
                console.log(req.page)
                next();
            })
        )
    })
};