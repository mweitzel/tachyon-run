var app = require('../../server')
  , fetch = require('../../fetch-env')
  , test = require('tape')
  , http = require('http')
  , concat = require('concat-stream')
  , request = require('../test-request-helper')
  , server
  , db = require('../../database/client')
  , postHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded'
    , 'Content-Length': 0
    }

test('start server', function(t) {
  server = app.listen(fetch('PORT'))
  t.end()
})

test('sign up with email succeeds and returns json saying so', function(t) {
  t.plan(2)

  var submittedEmail = 'asdf@example.com'

  var post_data = 'email='+submittedEmail
  postHeaders['Content-Length'] = post_data.length

  var req = request(
    {path:'/beta-signup', method: 'POST', headers: postHeaders}
  , function(response) {
      response.pipe(concat({encoding: 'string'}, function(body){
        t.equal(response.statusCode, 200)
        t.equal(
          body
        , JSON.stringify({ success: true, value: { email: submittedEmail } })
        )
      }))
    }
  )
  req.write(post_data)
  req.end()
})

// it won't add it another time, but this is public
// and I don't want people to be able to scrape for submitted emails
test('sign up again with the same email succeeds and returns json saying so', function(t) {
  t.plan(2)

  var submittedEmail = 'asdf@example.com'

  var post_data = 'email='+submittedEmail
  postHeaders['Content-Length'] = post_data.length

  var req = request(
    {path:'/beta-signup', method: 'POST', headers: postHeaders}
  , function(response) {
      response.pipe(concat({encoding: 'string'}, function(body){
        t.equal(response.statusCode, 200)
        t.equal(
          body
        , JSON.stringify({ success: true, value: { email: submittedEmail } })
        )
      }))
    }
  )
  req.write(post_data)
  req.end()
})

test('sign up with non-email fails and returns json saying so', function(t) {
  t.plan(2)

  var submittedEmail = 'not an email'

  var post_data = 'email='+submittedEmail
  postHeaders['Content-Length'] = post_data.length

  var req = request(
    {path:'/beta-signup', method: 'POST', headers: postHeaders}
  , function(response) {
      response.pipe(concat({encoding: 'string'}, function(body){
        t.equal(response.statusCode, 400)
        t.equal(
          body
        , JSON.stringify(
            { success: false, value: { error: 'request did not contain a valid email' } }
          )
        )
      }))
    }
  )
  req.write(post_data)
  req.end()
})

test('close server', function(t) {
  t.plan(1)
  require('pg').end()
  server.close(function(){
    t.pass()
  })
})
