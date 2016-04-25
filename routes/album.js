var User = require('../models/user');
var Album = require('../models/album')

var fs = require('fs');
var url = require('url')


exports.create = function(req, res) {
    var page = req.page;
    User.findOne({user_account: req.params.blogname}).populate('user_album').exec(function (err, user) {
        var album_name_box = [];
        var album_cover_box = [];
        var album_number_box = [];
        for(var i = (page.number - 1) * 8,j=0; i < page.number * 8 ; i++,j++) {
            if(user.user_album[i]){
                album_name_box[j] = user.user_album[i].album_name;
                album_cover_box[j] = user.user_album[i].album_cover;
                album_number_box[j] = user.user_album[i].album_picture.length;
            }
        }

        res.render('album', {
            userid: user._id,
            blogger: req.params.blogname,
            album: user.user_album.splice(page.from,8),
            album_name: album_name_box,
            page_index: page.number,
            album_cover: album_cover_box,
            album_number: album_number_box,
            bloggername: user.user_username
        });
    });
}

//创建相册
exports.submit = function(req, res, next){
    var dir = './public/images/album/';
    fs.exists(dir + req.session.uid, function (exists) {
        if(exists) {
            fs.mkdir(dir + req.session.uid + "/" + req.body.album,function(err){
                if(err) {
                    res.error("相册名已存在，请重新输入");
                    res.redirect('back');
                    return false
                }
                User.findById(req.session.uid,function(err,data){
                    var new_album = new Album({
                        album_user: data._id,
                        album_name : req.body.album,
                        album_time : Date.now() + (8 * 60 * 60 * 1000)
                    })
                    data.user_album.push(new_album);
                    new_album.save(function(err){
                        console.log(err)
                    })
                    data.save();
                    res.success("创建成功");
                    res.redirect('back');
                    return false
                })
                fs.mkdir(dir + req.session.uid + "/" + req.body.album + "/" + "small",function(err){
                    console.log(err)
                })
            });
        } else {
            fs.mkdir(dir + req.session.uid,function(err){
                fs.mkdir(dir + req.session.uid + "/" + req.body.album,function(err){
                    User.findById(req.session.uid,function(err,data){
                        var new_album = new Album({
                            album_user: data._id,
                            album_name : req.body.album,
                            album_time : Date.now() + (8 * 60 * 60 * 1000)
                        })
                        data.user_album.push(new_album);
                        new_album.save(function(err){
                            console.log(err)
                        })
                        data.save();
                        res.success("创建成功");
                        res.redirect('back');
                        return false
                    })
                    fs.mkdir(dir + req.session.uid + "/" + req.body.album + "/" + "small",function(err){
                        console.log(err)
                    })
                });
            });
        }
    });
}

//修改相册
exports.edit = function(req, res, next) {
    var dir = './public/images/album/';
    fs.rename(dir + req.session.uid + "/" + req.body.old_name, dir + req.session.uid + "/" + req.body.new_name,function (err) {
        if(err) {
            res.error("相册名已存在，请重新输入");
            res.redirect('back');
            return false
        }
        User.findById(req.session.uid, function(err,data){
            Album.findById(data.user_album[req.body.album_index], function(err,album){
                album.album_name = req.body.new_name;
                album.save();
                res.success("修改成功");
                res.redirect('back');
            })
        })
    });
}

//删除相册
exports.del = function(req,res, next){
    var dir = './public/images/album/';

    var rmdirSync = (function(){
        function iterator(url,dirs){
            var stat = fs.statSync(url);
            if(stat.isDirectory()){
                dirs.unshift(url);//收集目录
                inner(url,dirs);
            }else if(stat.isFile()){
                fs.unlinkSync(url);//直接删除文件
            }
        }
        function inner(path,dirs){
            var arr = fs.readdirSync(path);
            for(var i = 0, el ; el = arr[i++];){
                iterator(path+"/"+el,dirs);
            }
        }
        return function(dir,cb){
            cb = cb || function(){};
            var dirs = [];

            try{
                iterator(dir,dirs);
                for(var i = 0, el ; el = dirs[i++];){
                    fs.rmdirSync(el);//一次性删除所有收集到的目录
                }
                cb()
            }catch(e){//如果文件或目录本来就不存在，fs.statSync会报错，不过我们还是当成没有异常发生
                e.code === "ENOENT" ? cb() : cb(e);
            }
        }
    })();

    rmdirSync(dir + req.session.uid + "/" + req.body.del_name,function(err){
        if(err) {
            console.log(err);
        }
        console.log("删除aaa目录以及子目录成功");
        User.findById(req.session.uid,function(err,data){
            Album.findOneAndRemove( {_id: data.user_album[req.body.album_del_index]}, function(err,album){
                if(err){console.log(err)}
                User.findByIdAndUpdate(req.session.uid, { $pull:{ user_album: data.user_album[req.body.album_del_index] } },{new:true} ,function(err,data){
                    if(err){console.log(err)}
                    res.success("删除成功");
                    res.redirect('back');
                });
            })
        })
    });
}

