var test = require('tape')
  , delegate = require('../../delegate-with-transform')

test('delegates without transform', function(t) {
  t.plan(2)
  var a = {}
  var b = { x: 100 }
  delegate(a, b, 'x')
  t.equal(a.x, 100)
  b.x = 200
  t.equal(a.x, 200)
})

test('delegates with transform if provided', function(t) {
  t.plan(2)
  var a = {}
  var b = { x: 100 }
  delegate(a, b, 'x', function(x) { return x * 2})
  t.equal(a.x, 200)
  b.x = 200
  t.equal(a.x, 400)
})

test('delegate setting with and without provided transform')

test.only('can set it twice on the same object', function(t) {
  t.plan(1)
  var a = {}
    , b = {}
  t.doesNotThrow(function() {
    delegate(a, b, 'x')
    delegate(a, b, 'x')
  })
})
