var test = require('tape')
  , oscilate = require('../../oscillate-between-values')

test('x of 0 returns a, pi returns b', function(t) {
  t.plan(2)
  var a = 12345
  var b = 67890
  t.equal(
    oscilate(a, b, 0)
  , a
  )
  t.equal(
    oscilate(a, b, Math.PI)
  , b
  )
})

test('x of pi/2 returns (a+b)/2', function(t) {
  t.plan(1)
  t.equal(
    oscilate(100, 200, Math.PI/2)
  , 150
  )
})
