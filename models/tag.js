var mongoose = require('mongoose')  ;
var Schema = mongoose.Schema;

var tagSchema = new Schema({
    tag_user :{ type: Schema.Types.ObjectId, ref: 'Tag' },
    tag_name: {type:String},
    tag_number:{type:String}
})

module.exports = mongoose.model('Tag', tagSchema);