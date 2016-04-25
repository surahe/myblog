var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
var db = mongoose.connect('mongodb://localhost/population');

var personSchema = Schema({
    _id     : Number,
    name    : String,
    age     : Number,
    stories : [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

var storySchema = Schema({
    _creator : { type: Number, ref: 'Person' },
    title    : String,
    fans     : [{ type: Number, ref: 'Person' }]
});

var Person = mongoose.model('Person', personSchema);
var Story  = mongoose.model('Story', storySchema);


var aaron = new Person({ _id: 1, name: 'Sura', age: 22 });

var story1 = new Story({
    title: "hehe.",
    _creator: aaron._id    // 获得person 的_id值
});


aaron.stories.push(story1);

story1.save();
aaron.save()


Story
    .findOne({ title: 'hehe.' })
    .populate(' _creator')
    .exec(function (err, story) {
        if (err) console.log(err);
        console.log('The creator is %s', story._creator.name);
        // prints "The creator is Aaron"

        console.log('The creators age is %s', story._creator.age);
        // prints "The creators age is null'
    });



Person
    .findOne({ name: "Sura" })
    .populate('stories') // only works if we pushed refs to children
    .exec(function (err, person) {
        console.log(person);
    })
