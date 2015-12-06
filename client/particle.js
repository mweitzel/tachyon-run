var Sprite = require('./sprite')
  , sprites = require('./all-sprites')

module.exports = Particle

function Particle(spriteName, options) {
  this.sprite = sprites.get(spriteName)
  this.x = options.x
  this.y = options.y
}

Particle.prototype = {
  dx: 0
, dy: 0
, update: function(core) {
    this.x += this.dx
    this.y += this.dy
  }
, draw: Sprite.draw
, get spriteX() { return this.x - this.sprite.width/2 }
, get spriteY() { return this.y - this.sprite.height/2 }
}
