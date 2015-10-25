var test = require('tape')
  , follow = require('../../client/follow')

test('object A can follow an object B with x and y', function(t) {
  t.plan(4)
  var follower = {}
  var followee = { x: 20, y: 30 }
  var offsetX = 100
  var offsetY = 200

  follow.call(follower, followee, offsetX, offsetY)

  t.equal(follower.x, 120)
  t.equal(follower.y, 230)

  followee.x = 500
  followee.y = 300

  t.equal(follower.x, 600)
  t.equal(follower.y, 500)
})
