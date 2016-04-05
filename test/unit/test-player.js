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


test('emitSound emits a sound when sound file exists', function(t) {
  t.plan(1)
  var p = new Player()

  // emitSound returns true because it played a sound
  t.true(p.emitSound('test-blank'))

})

test('emitSound does not break when trying to play a sound that does not exist', function(t) {
  t.plan(1)
  var p = new Player()
  t.false(p.emitSound('definitely_not_a_sound_effect_name'))
})
