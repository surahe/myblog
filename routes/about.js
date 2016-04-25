var User = require('../models/user');

exports.display = function(req, res) {
    User.findOne({user_account: req.params.blogname}, function(err, user) {
        var birthdate = "";
        var gender = "";
        var genderBox  = ['男','女'];
        var marriageBox = ['','单身','热恋中','订婚','离婚','离异'];

        if(user.user_gender ==0 || user.user_gender == 1) {
            gender = genderBox[user.user_gender]
        }

        var marriage = marriageBox[user.user_marriage];

        if(user.user_birthdate) {
            birthdate = user.user_birthdate.getFullYear()+"年" + (user.user_birthdate.getMonth()+1) + "月"+ user.user_birthdate.getDate() + "日";
        }

        res.render('about', {
            blogname: req.params.blogname,
            username: user.user_username,
            logo: user.user_logo,
            name: user.user_name,
            gender: gender,
            birthdate: birthdate,
            city: user.user_province + user.user_city,
            marriage: marriage,
            job: user.user_job,
            email: user.user_email,
            phone: user.user_phone,
            qq: user.user_qq,
            bloggername: user.user_username
        })
    })
}