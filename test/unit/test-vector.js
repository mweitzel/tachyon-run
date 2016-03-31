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

test('can convert degrees to radians and reverse', function(t) {
  t.plan(2)
  t.deepEqual(
    vector.radianToDegree(Math.PI/2)
  , 90
  )
  t.deepEqual(
    vector.degreeToRadian(vector.radianToDegree(Math.PI/2))
  , Math.PI/2
  )
})

test('given angle, creates normalized vector', function(t) {
  t.plan(1)
  t.deepEqual(
    vector.fromRadian(0.5 * Math.PI).map(coughAhem)
  , [0, 1]
  )
})

function coughAhem(num) {
  if(Math.abs(num - Math.round(num)) < 0.000000000001)
    return Math.round(num)
  return num
}
