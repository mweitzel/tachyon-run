var _ = require('koa-route')
  , root = require('./route-root')
  , game = require('./route-game')
  , publicServePrebuilt = require('./route-public').servePrebuilt
  , publicBuildAndServe = require('./route-public').buildAndServe
  , notFound = require('./route-not-found')
  , betaSignUp = require('./route-beta-signup')

module.exports = [
  _.get('/', root)
, _.get('/demo', game)
, _.get('/*', process.env.PREBUILD_JS ? publicServePrebuilt : throughRoute)
, _.get('/*', publicBuildAndServe)
, _.get('/*', notFound)
, _.post('/beta-signup', betaSignUp)
]

function *throughRoute(page, next) { yield next }
