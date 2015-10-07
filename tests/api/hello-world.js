var app = require('../../server')
  , fetch = require('../../fetch-env')
  , test = require('tape')
  , http = require('http')
  , concat = require('concat-stream')
  , request = require('../test-request-helper')
  , server

test('start server', function(t) {
  server = app.listen(fetch('PORT'))
  t.end()
})

test('simple "/" request returns 200 OK', function (t) {
  t.plan(2)

  request(
    {path:'/'}
  , function(response) {
      response.pipe(concat({encoding: 'string'}, function(body){
        t.equal(response.statusCode, 200)
        t.ok(body.indexOf('hello world') > -1)
      }))
    }
  )
})

test('simple "/aljsnakjncoawejco" request returns 404 not found', function (t) {
  t.plan(2)

  request(
    {path:'/aljsnakjncoawejco'}
  , function(response) {
      response.pipe(concat({encoding: 'string'}, function(body){
        t.equal(response.statusCode, 404)
        t.ok(body.indexOf('not found') > -1)
      }))
    }
  )
})

test('get "/index.js" returns js file', function (t) {
  t.plan(3)

  request(
    {path:'/index.js'}
  , function(response) {
      response.pipe(concat({encoding: 'string'}, function(body){
        t.equal(response.statusCode, 200)
        t.equal(response.headers['content-type'], 'application/javascript; charset=utf-8')
        t.ok(body.indexOf('function') > -1)
      }))
    }
  )
})

test('close server', function(t) {
  t.plan(1)
  server.close(function(){
    t.pass()
  })
})
