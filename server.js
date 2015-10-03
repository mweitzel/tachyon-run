var koa = require('koa')
  , routes = require('./routes')

var app = module.exports = koa()

var middleware = routes

for(var i in middleware)
  app.use(middleware[i])
