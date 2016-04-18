var sprites = require('../all-sprites')
  , PE = require('../playable-entity')
  , beget = require('../../beget')
  , _ = require('lodash')
  , delegate = require('../../delegate-with-transform')

module.exports = Spike

function Spike(x, y) {
  this.team = 'hostile'
  this.x = x
  this.y = y
  this.sprite = sprites.get('spikes_a')
  ;['width', 'height'].map(delegate.bind(null, this, this.sprite))
  this.__defineGetter__('spriteX', function() { return this.x - this.sprite.width/2 })
  this.__defineGetter__('spriteY', function() { return this.y - this.sprite.height })
}

Spike.prototype = _.merge(
  beget(
    PE.prototype
  )
, {
    bounds: function() {
      return [this.x - this.width/2, this.y - this.height, this.width, this.height]
    }
  , applyDamage: function() {}
  , encounterStats: { baseDamage: 1 }
  , update: function() {}
  , dealtDamage: function(damage) { console.log('gotcha!!!') }
  }
)
