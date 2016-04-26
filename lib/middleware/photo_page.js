var User = require('../../models/user');
var Album = require('../../models/album');
var Photo = require('../../models/photo');

module.exports = function(req, res, next){
    var perpage =  8;
    //将参数page解析为十进制的整型值
    var page = Math.max(parseInt(req.param('page') || '1', 10), 1);
    //调用传入的函数
    User.findOne({user_account: req.params.blogname},"user_album").populate('user_album').exec(function(err,album){
            for(var i = 0; i < album.user_album.length; i++) {
                if(album.user_album[i].album_name == req.params.albumname) {
                    Photo .count({photo_album: album.user_album[i]._id},
                        (function(err, total){
                            if (err) return next(err);
                            if(req.param('page') > Math.ceil(total / perpage)) page = Math.ceil(total / perpage)-1;
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
                    break
                }
            }
        }
    )
};