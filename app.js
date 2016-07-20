var koa = require('koa');
var app = module.exports = koa();
var serveStatic = require('koa-static');

app.use(serveStatic(__dirname + '/web/'));

if (!module.parent) app.listen(3000);
