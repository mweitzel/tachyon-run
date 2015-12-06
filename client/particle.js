var Sprite = require('./sprite')
  , sprites = require('./all-sprites')

module.exports = Particle

function Particle(spriteName, options) {
  this.sprite = sprites.get(spriteName) || sprites.get('not_found')
  this.x = options.x
  this.y = options.y
}

Particle.prototype = {
  update: function(core) {
    this.x += this.dx
    this.y += this.dy
  }
, draw: Sprite.draw
, get spriteX() { this.x - this.sprite.width/2 }
, get spriteY() { this.y - this.sprite.height/2 }
}
