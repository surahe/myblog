var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connection = mongoose.connect('mongodb://localhost/myblog');

var schema = new Schema ({
    _id: String,
    sequence_value: Number
});

var products = mongoose.model('products', schema);
var counters = mongoose.model('counters', schema);

function getNextSequenceValue(sequenceName){
    return counters.findOneAndUpdate(
        {_id : sequenceName},
        {$inc:{sequence_value:1}},
        {new: true}
    ).exec();
}

getNextSequenceValue("productid").then(function(seq) {
    var one = new products({
        _id:seq.sequence_value,
        "product_name":"Apple iPhone",
        "category":"mobiles"
    })

    one.save(function(err){
        if(err){console.log(err)}
    })
});