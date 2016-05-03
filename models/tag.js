var mongoose = require('mongoose')  ;
var Schema = mongoose.Schema;

var tagSchema = new Schema({
    tag_user :{ type: Schema.Types.ObjectId, ref: 'User' },
    tag_name: {type:String},
    tag_number:{type:String},
    tag_amount:{type:Number}
})

module.exports = mongoose.model('Tag', tagSchema);