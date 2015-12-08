var keys = require('./keys')
  , atlas = require('./atlas')
  , spriteMeta = require('./sprite-meta-data')
  , Sprite = require('./sprite').bind(null, atlas, spriteMeta)
  , drawSprite = require('./sprite').draw
  , zLayers = require('./layer-z-defaults')

module.exports = Cursor

function Cursor() {
}

Cursor.prototype = {
  x: 0
, y: 0
, get z() { return zLayers.gui }
, update: function(core) {
    var pressed = core.input.getKeyDown.bind(core.input)
    if(pressed(keys.RIGHT) || pressed(keys.L)) { this.x += 16 }
    if(pressed(keys.LEFT)  || pressed(keys.H))  { this.x -= 16 }
    if(pressed(keys.UP)    || pressed(keys.K))    { this.y -= 16 }
    if(pressed(keys.DOWN)  || pressed(keys.J))  { this.y += 16 }
    var isDown = core.input.getKey.bind(core.input)
    if(isDown(keys.SHIFT)) {
      if(isDown(keys.RIGHT) || isDown(keys.L)) { this.x += 16 }
      if(isDown(keys.LEFT)  || isDown(keys.H))  { this.x -= 16 }
      if(isDown(keys.UP)    || isDown(keys.K))    { this.y -= 16 }
      if(isDown(keys.DOWN)  || isDown(keys.J))  { this.y += 16 }
    }
  }
, sprite: new Sprite('highlight')
, draw: drawSprite
}
