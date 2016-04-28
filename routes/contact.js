var User = require('../lib/user');

exports.form = function(req, res) {
    if(! req.session.uid) {
        res.redirect('/');
    } else {
        User.findOneData('_id',req.session.uid,function(err, user){
            res.render('contact', {
                email: user.user_email,
                phone: user.user_phone,
                qq: user.user_qq,
                blogname: user.user_account,
                bloggername: user.user_username
            });
        })
    }
}

exports.submit = function(req, res) {
    var data = req.body.contact;
    User.findOneData('_id',req.session.uid,function(err, user){
        user.set({user_email:data.email.trim(), user_phone:data.phone.trim(), user_qq:data.qq.trim()})
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
    })
}