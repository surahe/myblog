var mongoose = require('mongoose')  ;
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    message_user: { type: Schema.Types.ObjectId, ref: 'User' },
    message_content: {type: String},
    message_time: {type: Date},
    message_blog: { type: Schema.Types.ObjectId, ref: 'Blog' },
})

module.exports = mongoose.model('Message', messageSchema);