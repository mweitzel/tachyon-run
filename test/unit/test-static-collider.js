var test = require('tape')
  , Collider = require('../../client/static-collider')

test('canvas draws by half xp, so squidgedBoundsForDebugDraw nudges it', function(t) {
  t.plan(1)
  t.deepEqual(
    Collider.prototype.squidgedBoundsForDebugDraw([10,10,5,5])
  , [10.5, 10.5, 4, 4]
  )
})
