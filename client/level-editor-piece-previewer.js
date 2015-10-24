var Sprite = require('./sprite-preconfigured')
  , delegate = require('../delegate-with-transform')

module.exports = Previewer

function Previewer(sprites) {
  this.__sprites = sprites
}


Previewer.prototype = {

  __index: 0
, x: -50
, y: -50
, get active() {
    return this.filteredSprites[this.__index % this.filteredSprites.length]
  }
, get filteredSprites() {
    return this.sprites
  }
, next: function() {
    this.__index = this.__index + 1 % this.sprites.length
  }
, previous: function() {
    this.__index = this.__index + this.sprites.length - 1 % this.sprites.length
  }
, filter: ""
, popFilterLetter: function() {
    this.filter = this.filter.slice(0, this.filter.length-1)
  }
, get sprites() {
    return this.__sprites
  }
, get sprite() {
    return this.active
  }
, update: function() {

  }
, draw: Sprite.draw
, follow: function(obj, offsetX, offsetY) {
    
    delegate(this, obj, 'x', function(x) { return x + offsetX })
    delegate(this, obj, 'y', function(y) { return y + offsetY })
  }
}
