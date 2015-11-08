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

test('test with more example', function(t) {
  t.plan(1)
  var boundss = [
    [ 10, 10, 10, 10]
  , [ 20, 20, 10, 10]
  , [ 30, 30, 10, 10]
  , [ 40, 40, 10, 10]
  , [ 50, 50, 10, 10]
  , [ 60, 60, 10, 10]
  , [ 70, 70, 10, 10]
  , [ 90, 90, 10, 10]
  , [-10,-10, 10, 10]
  , [-20,-20, 10, 10]
  , [-30,-30, 10, 10]
  , [-40,-40, 10, 10]
  , [-50,-50, 10, 10]
  , [-60,-60, 10, 10]
  , [-70,-70, 10, 10]
  , [-90,-90, 10, 10]
  ]
  t.deepEqual(
    gbounds(boundss)
  , [-90, -90, 190, 190]
  )
})
