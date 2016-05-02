var User = require('../lib/user');
exports.form = function(req, res) {
    if(!req.session.uid) {
        res.redirect('/')
    } else {
        User.findOneData('_id',req.session.uid,function(err, user){
            if(user.user_birthdate) {
                res.render('intro', {
                    name: user.user_name,
                    gender: user.user_gender,
                    birthYear: user.user_birthdate.getFullYear(),
                    birthMonth: user.user_birthdate.getMonth()+1,
                    birthDate: user.user_birthdate.getDate(),
                    province: user.user_province,
                    city: user.user_city,
                    marriage: user.user_marriage,
                    job: user.user_job,
                    blogname: user.user_account,
                    bloggername: user.user_username
                });
            }   else {
                res.render('intro', {
                    name: user.user_name,
                    gender: user.user_gender,
                    birthYear: user.user_birthdate,
                    birthMonth: user.user_birthdate,
                    birthDate: user.user_birthdate,
                    province: user.user_province,
                    city: user.user_city,
                    marriage: user.user_marriage,
                    job: user.user_job,
                    blogname: user.user_account,
                    bloggername: user.user_username
                });
            }
        })
    }
}

exports.submit = function(req, res) {
    var data = req.body.intro;
    if(!data.city&& data.province) {
        res.error("请输入城市");
        res.redirect('back')
        return false
    }
    User.findOneData("_id",req.session.uid, function(err, user) {
        user.set({
            user_name: data.name.trim(),
            user_gender: data.gender,
            user_birthdate: data.birthdate,
            user_province: data.province,
            user_city: data.city,
            user_marriage: data.marriage,
            user_job: data.job
        })
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
    });
}