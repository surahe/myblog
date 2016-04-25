var User = require('../models/user');
var gm = require('gm')
    ,	fs = require('fs')
    ,	imageMagick = gm.subClass({ imageMagick : true });

exports.form = function(req, res) {
    if( ! req.session.uid) {
        res.redirect('/')
    } else {
        var logo;
        User.findById(req.session.uid, function(err, data) {
            if(data.user_logo) {
                res.render('logo', {logo: data.user_logo})
            }
            else {
                fs.readFile('public/images/logo/' + req.session.uid + '.jpg', function(err,data){
                    if(err){
                        logo = '/images/logo/default.jpg';
                        res.render('logo', {logo: logo});
                    }
                })
            }
        })

    }
}

exports.submit = function(req, res) {
    res.header('Content-Type', 'text/plain');
    var path = req.files.file.path;	//获取用户上传过来的文件的当前路径
    gm(path)
        .crop(req.body.w / req.body.pre_width * req.body.width, req.body.h / req.body.pre_height * req.body.height,
              req.body.x / req.body.pre_width * req.body.width, req.body.y / req.body.pre_height * req.body.height)
        .resize(150, 150, '!') //加('!')强行把图片缩放成对应尺寸150*150！
        .autoOrient()
        .write('public/images/logo/'+ req.session.uid + '.jpg' , function(err){
            if (err) {
                console.log(err);
                res.end();
            }
            fs.unlink(path);
            res.redirect('back')
        })
    User.findById(req.session.uid, function(err, data){
        data.user_logo = '/images/logo/'+ req.session.uid + '.jpg';
        data.save()
    })
}