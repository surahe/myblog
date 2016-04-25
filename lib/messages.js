var express = require('express');
//express.response对象是Express给响应对象用的原型
var res= express.response;

//把消息添加到来自任何Express请求的会话变量中
res.message = function(msg, type) {
    type = type || 'info';
    var sess = this.req.session;
    sess.messages = sess.messages || [];
    sess.messages.push({ type: type, string: msg });
}

//将类型为error的消息添加到消息队列
res.error = function(msg) {
    return this.message(msg, 'error')
}

res.success = function(msg) {
    return this.message(msg, 'success')
}

//在每个请求上用res.session.messages上的内容组装出res.locals.messages
module.exports = function(req, res, next){
    res.locals.messages = req.session.messages ;
    res.locals.removeMessages = function(){
        req.session.messages = [];
    };
    next();
};