var test = require('tape')
  , vector = require('../../vector')

test('returns length of vector', function(t) {
  t.plan(4)
  t.equal(vector.length([1,0]), 1)
  t.equal(vector.length([0, 30]), 30)
  t.equal(vector.length([0,0]), 0)
  t.equal(vector.length([1,1,1]), Math.sqrt(3))
})

test('returns normalized vectors', function(t) {
  t.plan(1)
  t.deepEqual(
    vector.normalize([1,1,1])
  , [0,0,0].map(function() { return 1/Math.sqrt(3) })
  )
})

test('normalizing a zero vector returns zero vector', function(t) {
  t.plan(1)
  t.deepEqual(
    vector.normalize([0,0])
  , [0,0]
  )
})
