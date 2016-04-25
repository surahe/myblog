var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var ueditor = require("ueditor")

//引入路由逻辑
var register = require('./routes/register');
var messages = require('./lib/messages');
var createcaptcha = require('./lib/captcha');
var login = require('./routes/login');
var user = require('./lib/middleware/user');
var intro = require('./routes/intro');
var modify = require('./routes/modify');
var contact = require('./routes/contact');
var logo = require('./routes/logo');
var account = require('./lib/middleware/account');
var albums = require('./routes/album');
var page = require('./lib/middleware/page')
var photo = require('./routes/photo');
var photo_page = require('./lib/middleware/photo_page');
var about = require('./routes/about');
var write = require('./routes/write')
var blogList = require('./routes/blog_list')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

//false改为true
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 60 * 1000 },
    cookie: { secure: false }
}))
app.use(user)
app.use(account)
app.use(messages)

app.use('/captcha.jpg', createcaptcha);

app.get('/register', register.form);
app.post('/register', register.submit);

app.get('/login', login.form);
app.post('/login', login.submit);

app.get('/logout', login.logout);

app.get('/set/intro',intro.form)
app.get('/set/modify',modify.form)
app.get('/set/contact',contact.form)
app.post('/set/contact',contact.submit)
app.post('/set/modify',modify.submit)
app.post('/set/intro',intro.submit)
app.get('/set/logo',logo.form)
app.post('/set/logo',multipartMiddleware,logo.submit);

app.get('/:blogname/album',page,albums.create);
app.post('/album',albums.submit);
app.post("/album_edit", albums.edit);
app.post("/album_del", albums.del);

app.get('/:blogname/album/:albumname',photo_page,photo.show);
app.post('/:blogname/album/:albumname',multipartMiddleware, photo.submit)
app.post('/photo_edit',photo.edit);
app.post('/photo_del', photo.del)
app.post('/photo_cover',photo.cover)

app.get('/:blogname/about', about.display)

app.get('/write',write.show)
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'),write.submit));
app.get('/get_tag', write.getTag)

app.get('/:blogname/bloglist',blogList.show)

module.exports = app;
