var User = require('../models/user');
var bcryptjs = require('bcryptjs');

//将密码加密并返回给User
User.hashPassword = function (pass){
    //生成有10个字符的盐
    User.salt = bcryptjs.genSaltSync(10);
    User.password = bcryptjs.hashSync(pass, User.salt);
    return User
};

//通过username获取数据
User.findOneData = function(key,value, fn) {
    if(key == 'username'){
        User.findOne({ user_username: value}, function (err, data) {
            fn(err,data)
        })
    };
    if(key == '_id'){
        User.findById(value, function (err, data) {
            fn(err,data)
        })
    };
    if(key == 'account'){
        User.findOne({user_account: value}, function (err, data) {
            fn(err,data)
        })
    }
}

//验证用户
User.authenticate = function(account,pass,fn){
    User.findOneData("account",account, function(err, user){
        if (!user) return fn();
        bcryptjs.hash(pass, user.user_salt, function(err, hash){
            if (err) return fn(err);
            if (hash == user.user_password) return fn(null, user);
            fn();
        });
    });
};

module.exports = User;