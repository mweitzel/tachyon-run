var test = require('tape')
  , Player = require('../../client/player')
  , hotSwap = require('../hot-swap')

test('player caches __previousAction when currentAction is set', function(t) {
  t.plan(3)
  var p = new Player()
  p.currentAction = 'banana'
  t.equal(p.currentAction, 'banana')
  p.currentAction = 'potato'
  t.equal(p.currentAction, 'potato')
  t.equal(p.__previousAction, 'banana')
})


test('emitSound emits a sound when currentAction differs from __previousAction', function(t) {
  t.plan(2)
  p = new Player()

  // ensure currentAction and __previousAction differ
  p.currentAction = 'banana'
  p.currentAction = 'potato'

  // stub currentIdentifier to return an existing track name
  var revert = hotSwap(p, 'currentIdentifier', function() { return 'test-blank' })

  // emitSound returns true because it played a sound
  t.true(p.emitSound())

  // potato has been set twice in a row, not currentAction and __previousAction match
  p.currentAction = 'potato'
  // emitSound returns false because no sound was played
  t.false(p.emitSound())

  // replace currentIdentifier
  revert()
})

test('emitSound does not break when trying to play a sound that does not exist', function(t) {
  t.plan(1)
  p = new Player()
  p.currentAction = 'definitely_not_a_sound_effect_name'

  t.false(p.emitSound())
})
