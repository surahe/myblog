var captchapng = require('captchapng');
module.exports = function(req, res) {
    var p = new captchapng(80,40,parseInt(Math.random()*9000+1000)); // width,height,numeric captcha
    req.session.captcha = p.dispNumber;
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
}
