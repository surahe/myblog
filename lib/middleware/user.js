//保持用户信息持续可访问
var User = require('../user');

/*
 res.locals是Express提供的请求层对象，可以将数据输出给模板，很像app.locals。
 */

module.exports = function(req, res, next) {
    var uid= req.session.uid;
    if(!uid) return next();
    //从数据库取出数据
    User.findOneData('_id', uid, function(err,user){
        if(err) return next(err);
        //将用户数据输出到响应对象中
        req.user = res.locals.user = user;
        return next();
    })
}