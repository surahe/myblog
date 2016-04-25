var User = require('../lib/user');
var bcryptjs = require('bcryptjs');

exports.form = function(req, res) {
    if(! req.session.uid) {
        res.redirect('/');
    } else {
        res.render('modify', {});
    }
}

exports.submit = function(req, res) {
    var data = req.body.modify;
    if(data.old && data.new && data.re) {
        if(data.re != data.new) {
            res.error("两次输入的密码不同");
            res.redirect('back');
        } else  {
            User.findOneData('_id',req.session.uid, function(err, user){
                bcryptjs.hash(data.old, user.user_salt, function(err, hash){
                    if(hash != user.user_password) {
                        res.error("密码错误");
                        res.redirect('back');
                    } else {
                        var pass = User.hashPassword(data.new).password;
                        var salt = User.salt;
                        user.set({user_password:pass, user_salt:salt});
                        user.save(function(err){
                            if(err) {
                                for(keys in err.errors) {
                                    var o = err.errors[keys];
                                }
                                res.error(o.message);
                                res.redirect('back')
                            }
                            else{
                                res.success("修改成功");
                                res.redirect('back')
                            }
                        })
                    }
                });
            })
        }
    } else {
        res.error("请输入所有内容");
        res.redirect('back')
    }
}