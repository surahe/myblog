var User = require('../lib/user');
var Tag = require('../models/tag');
exports.form = function(req, res){
    res.render('register', {});
};
exports.submit = function(req, res, next) {
    var data = req.body.user;
    //检查账号
    if(data.account && data.password && data.repassword && data.username) {
        User.findOneData("account",data.account, function(err, user) {
            if(err) console.log(err);
            if(user) {
                res.error("用户名已被占用");
                res.redirect('back');
            } else if(data.password != data.repassword){
                res.error("两次输入的密码不一样");
                res.redirect('back');
            } else if(!  /^\w{5,16}$/.test(data.password)) {
                res.error("密码为6-16位的数字、字符串和符号");
                res.redirect('back');
            } else {
                User.findOneData("username",data.username,function(err, user){
                    if(user) {
                        res.error('昵称已被占用')
                        res.redirect('back');
                    } else if(data.captcha!=req.session.captcha){
                        res.error('验证码不正确')
                    } else {
                        var pass = User.hashPassword(data.password).password;
                        var salt = User.salt;
                        user = new User({
                            user_account: data.account,
                            user_password: pass,
                            user_salt:salt,
                            user_username:data.username,
                            user_identity: 0,
                            user_logo:""
                        });
                        user.save(function(err){
                            if(err) {
                                for(keys in err.errors) {
                                    var o = err.errors[keys];
                                }
                                console.log(err);
                                res.error(o.message);
                                res.redirect('back')
                            }
                            //req.session.uid = user.id;
                            else{
                                var tag = new Tag({
                                    "tag_user" : user._id,
                                    "tag_name" : "默认分类",
                                    "tag_number" : "00",
                                    "tag_amount" : 0,
                                })
                                tag.save()
                                res.redirect('/login');
                            }
                        })
                    }
                })
            }
        })
    } else {
        res.error("请输入所有内容");
        res.redirect('back');
    }
}