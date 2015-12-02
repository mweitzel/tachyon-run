var test = require('tape')
  , sprites = require('../../client/all-sprites')

test('all-sprites returns sprite with new startTime', function(t) {
  t.plan(1)

  // cache
  var now = Date.now
  Date.now = function() { return 100 }

  var sprite = sprites.get('dummy')
  t.equal(sprite.startTime, 100)

  //replace
  Date.now = now
})
