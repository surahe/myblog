var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;
var connection = mongoose.connect('mongodb://localhost/myblog');

var userSchema = new Schema({
    user_account: {
        type: 'String',
        required: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z]\w{5,17}$/.test(v);
            },
            message: '账号由6-18个英文、数字或下划线组成,且第一位只能是英文'
        }
    },
    user_password: {
        type: 'String',
        required: true
    },
    user_salt: {
        type: 'String',
        require: true
    },
    user_identity: {
        type: "Number",
        required: true,
    },
    user_username: {
        type: 'String',
        required: true,
        validate: {
            validator: function(v) {
                return (v.length>=6 && v.length<=18)
            },
            message: '昵称长度在6-18位'
        }
    },

    //头像
    user_logo: {
        type: "String"
    },

    //个人资料
    user_name: {
        type: "String"
    },
    user_gender: {
        type: "Number"
    },
    user_birthdate: {
        type: "Date"
    },
    user_province: {
        type: "String"
    },
    user_city: {
        type: "String"
    },
    user_marriage: {
        type: "Number"
    },
    user_job: {
        type: "String"
    },
    //联系方式
    user_phone: {
        type: "Number",
        validate: {
            validator: function(v) {
                return /|^1[3|4|5|8]\d{9}$/.test(v);
            },
            message: '请输入正确的手机号码'
        }
    },
    user_qq: {
        type: 'Number',
        validate: {
            validator: function(v) {
                return /|^[1-9][0-9]{5,9}$/.test(v);
            },
            message: '请输入正确的QQ号码'
        }
    },
    user_email: {
        type: 'String',
        validate: {
            validator: function(v) {
                return /|^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(v);
            },
            message: '请输入正确的邮箱地址'
        }
    },
    user_album : [{ type: Schema.Types.ObjectId, ref: 'Album' }],
    user_tag:[{ type: Schema.Types.ObjectId, ref: 'Tag' }]
})

userSchema.plugin(deepPopulate);




module.exports = mongoose.model('User', userSchema);