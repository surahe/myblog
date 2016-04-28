var fs = require('fs');
var User = require('../models/user');
var Album = require('../models/album');
var Photo = require('../models/photo');
var gm = require('gm');


exports.show = function(req,res) {
    var page = req.page;
    var this_album;
    User.findOne({user_account: req.params.blogname}).deepPopulate('user_album.album_picture').exec(function (err, user) {
        for(var i  = 0; i < user.user_album.length; i++) {
            if(user.user_album[i].album_name == req.params.albumname) {
                this_album = user.user_album[i];
            }
        }
        var picture_name_box = [],
            picture_type_box = [],
            picture_id_box = [];
        for(var i = (page.number - 1) * 8, j = 0;i<  page.number * 8 ; i++,j++) {
            if(this_album.album_picture[i]) {
                picture_name_box[j] = this_album.album_picture[i].photo_name;
                picture_type_box[j] = this_album.album_picture[i].photo_type;
                picture_id_box[j] = this_album.album_picture[i]._id;
            }
        }
        fs.readdir('public/images/album/' + user._id + "/" + req.params.albumname, function(err, data){
            res.render('photo', {
                files: data,
                blogname: req.params.blogname,
                albumname:req.params.albumname,
                userid: user._id,
                picturename: picture_name_box,
                picturetype: picture_type_box,
                pictureid: picture_id_box,
                page_index: page.number,
                bloggername: user.user_username
            });
        });
    })
}

exports.submit = function(req, res) {
    res.header('Content-Type', 'text/plain');
    var path = req.files.file.path
    var name = req.body.photo.name;
    var type = req.body.photo.type;
    var album = req.body.photo.album;
    var new_width = 0;
    var new_height = 0;
    gm(path)
        .size(function (err, size) {
            if(size.width >= 200 && size.width > size.height) {
                var ratio = size.height / size.width;
                new_width = 200;
                new_height = new_width * ratio;
            } else if(size.height >= 200 && size.width < size.height) {
                var ratio = size.width / size.height;
                new_height = 200;
                new_width = new_height * ratio;
            } else {
                new_width = size.width;
                new_height = size.height;
            }
            this.resize(new_width, new_height, "!")
                .autoOrient()
                .write('public/images/album/'+ req.session.uid + '/'  + album + "/small/" + name + '.' + type, function(err){
                    if (err) {
                        console.log("write"+ err);
                        res.end();
                    }
                });
        })

    gm(path).autoOrient()
                .write('public/images/album/'+ req.session.uid + '/'  + album + "/"  + name + '.' + type, function(err){
                if (err) {
                    console.log(err);
                    res.end();
                }
                fs.unlink(path);
            });

    Album.find({album_user: req.session.uid}, function(err, albums){
        for(var i = 0; i < albums.length; i++) {
            if(albums[i].album_name == album) {
                var new_photo = new Photo({
                    photo_name: name,
                    photo_type : type,
                    photo_album : albums[i]._id,
                    photo_time : Date.now() + (8 * 60 * 60 * 1000)
                })
                albums[i].album_picture.push(new_photo);
                new_photo.save(function(err){
                    if(err) {console.log('photo_album ' + err)}
                })
                if(albums[i].album_picture.length == 1) {
                    albums[i].album_cover = name + "." + type;
                }
                albums[i].save(function(err){
                    if(err) {console.log('album ' + err)}
                })
            }
        }
    })
    res.end('hehe');
}

exports.edit = function(req, res) {
    var edit_id = req.body.edit_id,
        new_title = req.body.new_title,
        albumname = req.body.album_name,
        dir = './public/images/album/';

    Photo.findById(edit_id,function(err,data){
        var photo_name = data.photo_name;
        var photo_type = data.photo_type;
        fs.rename(dir + req.session.uid + "/" + albumname + "/" + photo_name + '.' +  photo_type,
            dir + req.session.uid + "/" + albumname + "/" + new_title + '.' + photo_type,
            function (err) {
                if(err) {
                    res.error("图片名已存在，请重新输入");
                    res.redirect('back');
                    return false
                }
                fs.rename(dir + req.session.uid + "/" + albumname + "/small/" + photo_name + '.' +  photo_type,
                    dir + req.session.uid + "/" + albumname + "/small/" + new_title + '.' + photo_type)
                Album.findOne({album_user: req.session.uid, album_name: albumname}, function(err, albums){
                    if(albums.album_cover == photo_name + '.' +  photo_type) {
                        albums.album_cover = new_title + '.' + photo_type;
                        albums.save()
                    }
                })
            }
        )
        data.photo_name = new_title;
        data.save();
        res.end('success');
    })
}

exports.del = function(req, res) {
    var delname = req.body.del_name;
    var photoindex = req.body.photo_index;
    var photoalbum = req.body.photo_album;
    var photoid = req.body.photo_id;
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
    rmdirSync(dir + req.session.uid + "/" + photoalbum + "/" + delname,function(err){
        if(err) {console.log(err);}
        rmdirSync(dir + req.session.uid + "/" + photoalbum + "/small/" + delname,function(err){
            if(err) {console.log(err);}
            Photo.findByIdAndRemove(photoid , function(err, photo){
                Album.findOneAndUpdate({album_user:req.session.uid, album_name:photoalbum}, { $pull:{ album_picture: photoid } },{new:true} ,function(err,album) {
                    if(err){console.log(err)}
                    if(delname == album.album_cover) {
                        album.album_cover = ""
                        album.save()
                    }
                    res.redirect('back');
                })
            })
        });
    });
}

exports.cover = function(req, res) {
    var album_name = req.body.albumName;
    var picture_name = req.body.pictureName;
    Album.findOne({album_user:req.session.uid, album_name:album_name},function(err, album) {
        album.album_cover = picture_name;
        console.log(album)
        album.save();
        res.end('success')
    })
}
