var test = require('tape')
  , spawn = require('../../client/spawn-from-script')

test('if no spawnable by script name, return nothing', function(t) {
  t.plan(1)
  t.equal(spawn.apply({}, ['illegalName']), undefined)
})

test("sends 'this' object's x and y as first arguments", function(t) {
  t.plan(1)
  spawn.spawnable.test_1 = function(x, y, other) {
    this.x = x
    this.y = y
    this.other = other
  }
  t.deepEqual(
    spawn.apply({x:5, y:10}, ['test_1', 'banana'])
  , {x:5, y:10, other:'banana'}
  )
})
