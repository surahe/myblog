var mongoose = require('mongoose')  ;
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    blog_title: {type:String},
    blog_content: {type:String},
    blog_summary: {type:String},
    blog_tag: { type: Schema.Types.ObjectId, ref: 'Tag'},
    blog_user: { type: Schema.Types.ObjectId, ref: 'User' },
    blog_time: {type: Date, index: true}
})

module.exports = mongoose.model('Blog', blogSchema);