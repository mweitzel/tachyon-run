var keys = require('./keys')
  , Sprite = require('./sprite-preconfigured')
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
    var isDown = core.input.getKey.bind(core.input)

    var movement = isDown(keys.CTRL) ? 4 : 16
    if(pressed(keys.RIGHT) || pressed(keys.L)) { this.x += movement}
    if(pressed(keys.LEFT)  || pressed(keys.H))  { this.x -= movement }
    if(pressed(keys.UP)    || pressed(keys.K))    { this.y -= movement }
    if(pressed(keys.DOWN)  || pressed(keys.J))  { this.y += movement }
    if(isDown(keys.SHIFT)) {
      if(isDown(keys.RIGHT) || isDown(keys.L)) { this.x += movement }
      if(isDown(keys.LEFT)  || isDown(keys.H))  { this.x -= movement }
      if(isDown(keys.UP)    || isDown(keys.K))    { this.y -= movement }
      if(isDown(keys.DOWN)  || isDown(keys.J))  { this.y += movement }
    }
  }
, sprite: new Sprite('highlight')
, draw: Sprite.draw
}
