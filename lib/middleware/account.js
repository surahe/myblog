//保持用户信息持续可访问
var User = require('../user');
module.exports = function(req, res, next) {
    var account= req.session.user_account;
    if(!account) return next();
    //从数据库取出数据
    User.findOneData('user_account', account, function(err,account){
        if(err) return next(err);
        //将用户数据输出到响应对象中
        req.user_account = res.locals.user_account = account;
        return next();
    })
}