var test = require('tape')
  , dir = require('../../client/word-directions')

test('word directions creates vector from words', function(t) {
  t.plan(8)
  t.deepEqual(dir.toVector([]), [0,0])
  t.deepEqual(dir.toVector(['up']), [0,-1])
  t.deepEqual(dir.toVector(['down']), [0,1])
  t.deepEqual(dir.toVector(['up', 'up']), [0,-2])
  t.deepEqual(dir.toVector(['left']), [-1,0])
  t.deepEqual(dir.toVector(['right']), [1,0])
  t.deepEqual(dir.toVector(['left', 'right']), [0,0])
  t.deepEqual(dir.toVector(['right', 'down']), [1,1])
})
