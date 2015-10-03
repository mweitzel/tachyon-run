var _ = require('koa-route')
  , fs = require('fs')
  , indexBody = fs.readFileSync('./public/build/index.html')

module.exports = [
  _.get('/', root)
, _.get('*', notFound)
]

function *root(){
  this.body = indexBody
  this.type = 'html'
}

function *notFound() {
  this.status = 404
  this.body = '404 - page not found'
}
