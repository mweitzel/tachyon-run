var app = require('../../server')
  , server = app.listen(8000)
  , test = require('tape')
  , http = require('http')
  , concat = require('concat-stream')
  , request = require('../test-request-helper')

test('simple "/" request returns 200 OK', function (t) {
  t.plan(2)

  request(
    {path:'/'}
  , function(response) {
      response.pipe(concat({encoding: 'string'}, function(body){
        t.equal(200, response.statusCode)
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
        t.equal(404, response.statusCode)
        t.ok(body.indexOf('not found') > -1)
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
