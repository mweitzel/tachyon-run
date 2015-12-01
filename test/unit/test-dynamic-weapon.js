var test = require('tape')
  , dw = require('../../client/dynamic-weapon')

test('a weapon is created from full materia list, a name, and select configured materia', function(t) {
  t.plan(1)
  var parent = { team: 'enemy' }
  t.equal(dw.create({}, 'banana gun', [], parent).weaponName, 'banana gun')
})

test('generates list of attack types from list of materia names', function(t) {
  t.plan(1)
  t.deepEqual(
    dw.attackTypesFromMateria(
      ['bluestone_fortran', 'summon_beowulf_geonetti', 'redstone_bristar']
    )
  , ['ice', 'fire']
  )
})