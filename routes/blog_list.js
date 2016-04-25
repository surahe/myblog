exports.show = function(req, res){
    res.render('blog_list',{
        blogger: req.params.blogname
    })
}