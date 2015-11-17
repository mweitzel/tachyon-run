var test = require('tape')
  , Saver = require('../../client/level-editor-serialize')
  , draw = require('../../client/sprite').draw
  , _ = require('lodash')
  , beget = require('../../beget')

test('serializes blocks from a level', function(t) {
  t.plan(3)
  var sprites = [ { name: 'block_a' }, { name: 'block_b' } , { name: 'token_door' } ]
  var saver = new Saver(sprites)
  var levelPieces = [
    { __isLevelPiece: true
    , layer: 'ground'
    , z: 0
    , name: 'block_a'
    , sprite: beget( sprites[0] )
    , draw: draw
    , x: 1, y: 2 }
  , { __isLevelPiece: true
    , layer: 'ground'
    , z: 0
    , name: 'block_a'
    , sprite: beget( sprites[0] )
    , draw: draw
    , x: 3, y: 4 }
  , { __isLevelPiece: true
    , layer: 'ground'
    , z: 0
    , name: 'block_b'
    , sprite: beget( sprites[1] )
    , draw: draw
    , x: 5, y: 6 }
  , { __isLevelPiece: true
    , layer: 'script'
    , z: 400
    , name: 'token_door'
    , script: 'whatever istructions'
    , sprite: beget( sprites[2] )
    , draw: draw
    , x: 7, y: 8 }
  , { __isLevelPiece: true
    , layer: 'meta'
    , name: 'bastion'
    , background: '#000' }
  , { name: 'banana'
    , x: 8, y: 9 }
  ]


  var serialized = saver.serialize(levelPieces)

  t.deepEqual(
    JSON.parse(serialized)
  , { ground: { block_a: [[1,2],[3,4]], block_b: [[5,6]] }
    , script: { token_door: [ [ 7, 8, 'whatever istructions' ] ] }
    , meta: { background: '#000', name: 'bastion' }
    }
  )

  var actual =   _.sortBy( saver.parse(serialized)                       , byXYName)
  var expected = _.sortBy( _(levelPieces).reject({name:'banana'}).value(), byXYName)
  t.deepEqual(actual, expected)

  t.equal(actual[1].sprite.name, 'block_a')

  function byXYName(obj) { return [obj.x, obj.y, obj.name].join('-') }
})

test('can save objects with values of 0', function(t) {
  t.plan(1)
  var sprites = [ { name: 'block_a' } ]
  var saver = new Saver(sprites)
  var levelPieces = [
    { __isLevelPiece: true
    , layer: 'ground'
    , z: 0
    , name: 'block_a'
    , sprite: beget( sprites[0] )
    , draw: draw
    , x: 0, y: 0 }
   ]

  t.deepEqual(
    saver.parse(saver.serialize(levelPieces))
  , levelPieces
  )
})
