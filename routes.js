var _ = require('koa-route')
  , root = require('./route-root')
  , game = require('./route-game')
  , pub = require('./route-public')
  , notFound = require('./route-not-found')
  , betaSignUp = require('./route-beta-signup')

module.exports = [
  _.get('/', root)
, _.get('/demo', game)
, _.get('/*', pub)
, _.get('/*', notFound)
, _.post('/beta-signup', betaSignUp)
]
