var test = require('tape')
  , gbounds = require('../../client/generate-encapsulating-bound')

test('smallest top and left and largest bottom and right', function(t) {
  t.plan(1)
  var boundss = [
    [-10,-10, 10, 10]
  , [ 10, 10, 14, 14]
  , [  0, 30,  0,  5]
  , [-30,  0,  5,  0]
  ]
  t.deepEqual(
    gbounds(boundss)
  , [-30, -10, 54, 45]
  )
})
