var _ = require('koa-route')
  , root = require('./route-root')
  , pub = require('./route-public')
  , notFound = require('./route-not-found')

module.exports = [
  _.get('/', root)
, _.get('/*', pub)
, _.get('/*', notFound)
]
