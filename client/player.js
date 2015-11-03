var _ = require('lodash')
  , Sprite = require('./sprite-preconfigured')
  , collider = require('./collider')
  , StaticCollider = require('./static-collider')
  , keys = require('./keys')
  , applyPhysics = require('./apply-physics')
  , spyReturns = require('../tee-callback')
  , sprites = require('./all-sprites')

module.exports = Player

function Player(attrs) {
  _.merge(this, attrs)
  this.sprite = sprites.get('char_c')
  this.__defineGetter__('spriteX', function() { return this.x - 16 })
  this.__defineGetter__('spriteY', function() { return this.y - 32 })
}

var PE = require('./playable-entity')
  , beget = require('../beget')

Player.prototype = _.merge(
  beget(PE.prototype)
, {
    bounds: function() {
      return [this.x-7, this.y-24, 14, 24]
    }
  , draw: Sprite.draw
  , drawDebug: StaticCollider.prototype.drawDebug
  , squidgedBoundsForDebugDraw: StaticCollider.prototype.squidgedBoundsForDebugDraw
  , respondToControllerIntent: function(core) {
      if(core.input.getKey(keys.RIGHT)) {
        this.sprite.mirror = true
        this.dx += 0.01
      }
      else if(core.input.getKey(keys.LEFT)) {
        this.sprite.mirror = false
        this.dx -= 0.01
      }
      else { this.dx *= 0.9
        if(Math.abs(this.dx) < 0.01) { this.dx = 0 }
      }

      if(core.input.getKeyDown(keys.SPACE)) {
        if(this.__lastGroundCollisionSides.indexOf('bottom') > -1) {
          this.dy = -0.25
        }
      }
    }
  }
)
