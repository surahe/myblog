var Message= require('../../models/message');

module.exports = function(req, res, next){
    var perpage =  10;
    //将参数page解析为十进制的整型值
    var page = Math.max(parseInt(req.param('page') || '1', 10), 1);
    //调用传入的函数
    Message.count({message_blog: req.params.blogid},
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
};