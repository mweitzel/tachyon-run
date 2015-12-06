var test = require('tape')
  , damage = require('../../client/receive-damage')
  , td = require('testdouble')

test('generates damage based on attack types', function(t) {
  t.plan(1)
  var to = { fireAttack: 0.2, fireResist: 0.2, iceResist: 0.7 }
  var from = { baseDamage: 4, fireAttack: 0.2 }
  t.equal(
    damage.calculate(from, to)
  , 4 * 1.2 * 0.8
  )
})

test('generates damage based on attack types', function(t) {
  t.plan(2)
  var to = { }
  var from = { }
  t.equal(damage.calculate( from            , to) , 0)
  t.equal(damage.calculate({ baseDamage: 7 }, to) , 7)
})

test('applies calculated damage to "this"', function(t) {
  t.plan(1)

  var to = { applyDamage: td.create() }
  var other = { dealtDamage: td.create(), encounterStats: { baseDamage: 10 } }
  damage.call(to, other)

  t.doesNotThrow(function() {
    td.verify(to.applyDamage( 10 ))
    td.verify(other.dealtDamage( 10 ))
  })
})

test('call no apply/dealt functions if no damage', function(t) {
  t.plan(2)

  var to = { applyDamage: td.create() }
  var other = { dealtDamage: td.create(), encounterStats: { baseDamage: 0 } }
  damage.call(to, other)

  t.throws(function() {
    td.verify(to.applyDamage( 10 ))
  })
  t.throws(function() {
    td.verify(other.dealtDamage( 10 ))
  })
})
