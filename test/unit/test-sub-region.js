var test = require('tape')
  , sub = require('../../client/sub-region.js')
  , round = Math.round.bind(Math)

test('creates sub region by passing bounds and ratio for each componant', function(t) {
  t.plan(1)
  var bounds = [100,100,200,150]
  t.deepEqual(
    sub(bounds, [0,0,1/3,1/3])  .map(round)
  , [100, 100, 66.6, 50]        .map(round)
  )
})
