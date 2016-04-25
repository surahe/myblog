var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albumSchema = new Schema({
    album_name: {type:String},
    album_user: { type: Schema.Types.ObjectId, ref: 'User' },
    album_time: {type: Date},
    album_picture:[{ type: Schema.Types.ObjectId, ref: 'Photo' }],
    album_cover: {type:String}
})

module.exports =  mongoose.model('Album', albumSchema);

