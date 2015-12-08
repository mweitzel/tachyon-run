var test = require('tape')
  , median = require('../../median')

test('can get median from odd numbers', function(t) {
  t.plan(1)
  t.equal(
    median(1,5,200)
  , 5
  )
})

test('can get median from even numbers', function(t) {
  t.plan(1)
  t.equal(
    median(1,5,7,200)
  , 6
  )
})
