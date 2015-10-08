var test = require('tape')
  , td = require('testdouble')
  , pub = require('../../route-public')
  , co = require('co')
  , compose = require('koa-compose')

test('public route passes to next when not found', function (t) {
  t.plan(2)
  var ctx = {}

  co.wrap(compose([
    function *(next) { yield* pub.call(this, 'sindafs.ps', next) }
  , function *(next) { t.pass() }
  ])).call(ctx)
  .then(
    t.pass.bind(t)
  , t.fail.bind(t)
  )
})

test('public route serves index.js', function (t) {
  t.plan(1)
  var ctx = {}

  co.wrap(compose([
    function *(next) { yield* pub.call(this, 'index.js', next) }
  , function *(next) { t.fail() }
  ])).call(ctx)
  .then(
    t.pass.bind(t)
  , t.fail.bind(t)
  )
})
