var User  = require("./user.js")
var Album = require("./album.js")
User.findOne({user_username:'surahe'},function(err,data){
    var album1 = new Album({
        album_user: data._id,
        album_name : "second",
        album_time : Date.now() + (8 * 60 * 60 * 1000)
    })
    data.user_album.push(album1);
    album1.save(function(err,data){
        console.log(err)
    })
    data.save()
})