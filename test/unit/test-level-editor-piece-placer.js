var test = require('tape')
  , Placer = require('../../client/level-editor-piece-placer')

test('adds right piece where specified', function(t) {
  t.plan(4)
  var coreEntities = []
  var cursor = { x: 20, y: 30 }
  var sprites = [ { name: 'foo' }, { name: 'bar'} ]

  var placer = new Placer(sprites)
  placer.addPiece(coreEntities, cursor, 'foo')

  t.deepEqual(coreEntities[0].sprite, { name: 'foo' })
  t.equal(coreEntities[0].x, 20)
  t.equal(coreEntities[0].y, 30)
  t.equal(coreEntities[0].__isLevelPiece, true)
})

test('removes existing __isLevelPiece pieces from same x y when placing new', function(t) {
  t.plan(2)
  var coreEntities = [{x: 0, y: 0, __isLevelPiece: true, sprite: { name: 'old-sprite' }}]
  var cursor = { x: 0, y: 0 }
  var sprites = [ { name: 'foo' }, { name: 'bar'} ]

  var placer = new Placer(sprites)
  placer.addPiece(coreEntities, cursor, 'foo')

  t.equal(coreEntities.length, 1)
  t.equal(coreEntities[0].sprite.name, 'foo')
})

test('does not remove non __isLevelPiece pieces from same x y when placing', function(t) {
  t.plan(3)
  var coreEntities = [{x: 0, y: 0, __isLevelPiece: false, sprite: { name: 'other-sprite' }}]
  var cursor = { x: 0, y: 0 }
  var sprites = [ { name: 'foo' }, { name: 'bar'} ]

  var placer = new Placer(sprites)
  placer.addPiece(coreEntities, cursor, 'foo')

  t.equal(coreEntities.length, 2)
  t.equal(coreEntities[0].sprite.name, 'other-sprite')
  t.equal(coreEntities[1].sprite.name, 'foo')
})
