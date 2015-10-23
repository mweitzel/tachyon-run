var format = require('../format-base64-for-html')
var keys = require('./keys')
  , atlas = require('./atlas')
  , spriteMeta = require('./sprite-meta-data')
  , Sprite = require('./sprite').bind(null, atlas, spriteMeta)
  , drawSprite = require('./sprite').draw
  , Cursor = require('./level-editor-cursor')


module.exports = function(core) {
  core.entities.push(new Cursor(core))

  // temporary, for visual reference
  core.entities.push(new BlockA())
}

function BlockA() { }
BlockA.prototype = {
  x: 0
, y: 0
, sprite: new Sprite('block_a')
, draw: drawSprite
}
