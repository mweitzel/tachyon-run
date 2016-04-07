var koa = require('koa')
  , morgan = require('koa-morgan')
  , routes = require('./routes')

var app = module.exports = koa()

var middleware = [
  morgan.middleware('combined', {})
].concat(routes)

for(var i in middleware)
  app.use(middleware[i])
