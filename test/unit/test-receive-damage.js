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
  t.equal(damage.calculate( from            , to) , 1)
  t.equal(damage.calculate({ baseDamage: 7 }, to) , 7)
})

test('applies calculated damage to "this"', function(t) {
  t.plan(1)

  var to = { applyDamage: td.create() }
  var other = { dealtDamage: td.create() }
  damage.call(to, other)

  t.doesNotThrow(function() {
    td.verify(to.applyDamage( 1 ))
    td.verify(other.dealtDamage( 1 ))
  })
})
