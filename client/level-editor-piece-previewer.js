var Sprite = require('./sprite-preconfigured')
  , StringSprite = require('./renderable-string')
  , follow = require('./follow')
  , zLayers = require('./layer-z-defaults')
  , _ = require('lodash')

module.exports = Previewer

function Previewer(sprites) {
  this.__sprites = sprites
}

Previewer.prototype = {
  __index: 0
, x: 0
, y: 0
, z: zLayers.gui
, get active() {
    return this.filteredSprites[this.__index % this.filteredSprites.length]
  }
, get filteredSprites() {
    var trimmed = _.filter(
      this.sprites
    , function(sprite) { return _.startsWith(sprite.name, this.filter) }.bind(this)
    )
    return trimmed.length > 0
      ? trimmed
      : this.sprites
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
, get currentStringSprite() {
    if(this.__cachedStringSprite && this.__cachedStringSprite.string == this.active.name)
      return this.__cachedStringSprite
    else {
      this.__cachedStringSprite = new StringSprite(this.active.name)
      follow.call(this.__cachedStringSprite, this, this.currentSpriteWidth(), 0)
    }
    return this.__cachedStringSprite
  }
, currentSpriteWidth: function() {
    return this.active.getFrame().data[3] // [x,y,w,h]
  }
, draw: function(ctx) {
    this.currentStringSprite.draw(ctx)
    Sprite.draw.call(this, ctx)
  }
}

