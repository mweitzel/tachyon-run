var test = require('tape')
  , Player = require('../../client/player')

test('player caches __previousAction when currentAction is set', function(t) {
  t.plan(3)
  var p = new Player()
  p.currentAction = 'banana'
  t.equal(p.currentAction, 'banana')
  p.currentAction = 'potato'
  t.equal(p.currentAction, 'potato')
  t.equal(p.__previousAction, 'banana')
})
