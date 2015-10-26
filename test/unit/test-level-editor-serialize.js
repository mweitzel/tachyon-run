var test = require('tape')
  , Saver = require('../../client/level-editor-serialize')
  , draw = require('../../client/sprite').draw
  , _ = require('lodash')

test('serializes blocks from a level', function(t) {
  t.plan(2)
  var sprites = [ { name: 'block_a' }, { name: 'block_b' } ]
  var saver = new Saver(sprites)
  var levelPieces = [
    { __isLevelPiece: true
    , layer: 'ground'
    , name: 'block_a'
    , sprite: sprites[0]
    , draw: draw
    , x: 1, y: 2 }
  , { __isLevelPiece: true
    , layer: 'ground'
    , name: 'block_a'
    , sprite: sprites[0]
    , draw: draw
    , x: 3, y: 4 }
  , { __isLevelPiece: true
    , layer: 'ground'
    , name: 'block_b'
    , sprite: sprites[1]
    , draw: draw
    , x: 5, y: 6 }
  , { name: 'banana'
    , x: 7, y: 8 }
  ]


  var serialized = saver.serialize(levelPieces)

  t.deepEqual(
    JSON.parse(serialized)
  , { ground: { block_a: [[1,2],[3,4]], block_b: [[5,6]] } }
  )

  t.deepEqual(
    saver.parse(serialized)
  , _(levelPieces).reject({name:'banana'}).value()
  )
})
