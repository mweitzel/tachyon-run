var _ = require('koa-route')
  , root = require('./route-root')
  , notFound = require('./route-not-found')

module.exports = [
  _.get('/', root)
, _.get('*', notFound)
]
