var mongoose = require('mongoose')  ;
var Schema = mongoose.Schema;

var photoSchema = new Schema({
    photo_name: {type:String},
    photo_type: {type:String},
    photo_album: { type: Schema.Types.ObjectId, ref: 'Album' },
    photo_time: {type: Date}
})

module.exports = mongoose.model('Photo', photoSchema);