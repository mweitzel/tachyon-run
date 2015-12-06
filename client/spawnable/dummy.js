var Sprite = require('../sprite-preconfigured')
  , sprites = require('../all-sprites')
  , PE = require('../playable-entity')
  , beget = require('../../beget')
  , _ = require('lodash')
  , notice = require('../notice')

module.exports = Dummy

function Dummy(x, y) {
  this.team = 'neutral'
  this.x = x
  this.y = y
  this.sprite = sprites.get('dummy')
  this.width = 14
  this.height = 13
  this.health = 20
  this.__defineGetter__('spriteX', function() { return this.x - this.sprite.width/2 })
  this.__defineGetter__('spriteY', function() { return this.y - this.sprite.height })
  this.respondToControllerIntent = function() { }
}
Dummy.prototype = _.merge(
  beget(
    PE.prototype
  )
, {
    bounds: function() {
      return [this.x - this.width/2, this.y - this.height, this.width, this.height]
    }
  , use: function(user, core) {
      notice('it looks like a diaper', user, core)
    }
  }
)
