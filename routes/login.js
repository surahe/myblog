var User = require('../lib/user');

exports.form = function(req, res) {
    res.render('login', {});
}

exports.submit = function(req, res, next){
    var data = req.body.user;
    if(data.captcha != req.session.captcha) {
        res.error("验证码错误");
        res.redirect('back');
    } else{
        User.authenticate(data.account.trim(), data.password, function(err, user){
            if (err) return next(err);
            if (user) {
                req.session.uid = user.id;
                req.session.account = user.user_account;
                res.redirect('/u/' + user.user_account);
            } else {
                res.error("账号或密码错误");
                res.redirect('back');
            }
        });
    }
};

exports.logout = function(req, res){
    req.session.destroy(function(err) {
        if (err) console.log(err);
        res.redirect('/');
    });
};