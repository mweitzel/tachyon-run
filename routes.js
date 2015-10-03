var _ = require('koa-route')

module.exports = [
  _.get('/', root)
, _.get('*', notFound)
]

function *root(){
  this.body = 'Hello World'
}

function *notFound() {
  this.status = 404
  this.body = '404 - page not found'
}
