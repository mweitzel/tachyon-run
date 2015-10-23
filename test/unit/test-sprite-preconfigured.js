var test = require('tape')
  , Sprite = require('../../client/sprite-preconfigured')
  , SpriteUnconfigured = require('../../client/sprite')
  , atlas = require('../../client/atlas')
  , spriteMeta = require('../../client/sprite-meta-data')

test('preconfigured sprite can be created from name alone', function(t) {
  t.plan(1)
  var sprite = new Sprite('banana')
  t.equal(sprite.atlas, atlas)
})

test('preconfigured sprite has drawSprite attatched as a convenience method', function(t) {
  t.plan(1)
  t.equal(Sprite.draw, SpriteUnconfigured.draw)
})

test('can draw', function(t) {
  t.plan(1)
  t.equal(Sprite.draw, SpriteUnconfigured.draw)
})
