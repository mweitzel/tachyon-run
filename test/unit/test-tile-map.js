var test = require('tape')
  , TileMap = require('../../client/tile-map')
  , _ = require('lodash')

test('can instantiate tileMap', function(t) {
  t.plan(1)
  var maxTileSize = 32
  var tm = new TileMap(32)
  t.equal(tm.maxTileSize, 32)
})

test('smushToKey flattens to simple key, divided by tilesize and rounded', function(t) {
  t.plan(2)
  t.equal(
    TileMap.prototype.smushToKey.call({maxTileSize: 32}, [35, 12])
  , '1,0'
  )
  t.equal(
    TileMap.prototype.smushToKey.call({maxTileSize: 16}, [35, 12])
  , '2,1'
  )
})

test('tileKeysFor obj returns unique list of tiles obj hits', function(t) {
  t.plan(1)

  var obj = { bounds: function() { return [16,16,16,32] } }
  var tm = new TileMap(32)


  t.deepEqual(
    tm.tileKeysFor(obj)
  , ['1,1','1,2']
  )
})

test('when caching an obect, store keys on object', function(t) {
  t.plan(1)

  var obj = { bounds: function() { return [5,5,32,32] } }
  var tm = new TileMap(32)

  tm.cache(obj)

  t.deepEqual(
    _(obj.__cachedTileKeys).sort().value()
  , _([ '0,0', '1,0', '0,1', '1,1' ]).sort().value()
  )
})

test('when caching an obect, store object in keys', function(t) {
  t.plan(4)

  var obj = { bounds: function() { return [16,16,32,32] } }
  var tm = new TileMap(32)

  tm.cache(obj)

  t.deepEqual(
    tm.map['1,1']
  , [obj]
  )
  t.deepEqual(
    tm.map['2,1']
  , [obj]
  )
  t.deepEqual(
    tm.map['1,2']
  , [obj]
  )
  t.deepEqual(
    tm.map['2,2']
  , [obj]
  )
})

test('caching an updated object changes the map data', function(t) {
  t.plan(2)

  var b = [0,0,32,32]

  var obj = { bounds: function() { return b } }
  var tm = new TileMap(32)

  tm.cache(obj)

  t.deepEqual(
    tm.map
  , { '0,0': [obj]
    , '0,1': [obj]
    , '1,0': [obj]
    , '1,1': [obj] }
  )

  b[0] = 32
  b[1] = 32

  tm.cache(obj)

  t.deepEqual(
    tm.map
  , { '0,0': []
    , '0,1': []
    , '1,0': []
    , '1,1': [obj]
    , '1,2': [obj]
    , '2,1': [obj]
    , '2,2': [obj] }
  )
})

test('caching an updated object changes the objects chached keys', function(t) {
  t.plan(2)

  var b = [0,0,32,32]

  var obj = { bounds: function() { return b } }
  var tm = new TileMap(32)

  tm.cache(obj)

  t.deepEqual(
    _(obj.__cachedTileKeys).sort().value()
  ,_([ '0,0' , '0,1' , '1,0' , '1,1' ]).sort().value()
  )

  b[0] = 32
  b[1] = 32

  tm.cache(obj)

  t.deepEqual(
    _(obj.__cachedTileKeys).sort().value()
  , _([ '1,1' , '1,2' , '2,1' , '2,2' ]).sort().value()
  )
})

test('retrieves all objects cached with that key', function(t) {
  t.plan(5)

  var wayBot = {            bounds: function() { return [0,-32,32,32] } }
  var bot = { name: 'obj1', bounds: function() { return [0,  0,32,32] } }
  var mid = {               bounds: function() { return [0, 32, 0, 0] } }
  var top = { name: 'obj2', bounds: function() { return [0, 32,32,32] } }
  var wayTop = {            bounds: function() { return [0, 64,32,32] } }
  var tm = new TileMap(32)

  tm.cache(bot)
  tm.cache(top)

  t.deepEqual(
    tm.getOthersNear(wayBot)
  , [bot]
  )

  t.deepEqual(
    tm.getOthersNear(bot)
  , [bot, top]
  )

  t.deepEqual(
    tm.getOthersNear(mid)
  , [bot, top]
  )

  t.deepEqual(
    tm.getOthersNear(top)
  , [bot, top]
  )

  t.deepEqual(
    tm.getOthersNear(wayTop)
  , [top]
  )
})
