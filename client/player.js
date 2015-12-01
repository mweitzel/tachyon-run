var _ = require('lodash')
  , Sprite = require('./sprite-preconfigured')
  , keys = require('./keys')
  , sprites = require('./all-sprites')
  , closestTo = require('./collider').objClosestTo
  , saveFile = require('./save-file')

module.exports = Player

function Player(attrs) {
  _.merge(this, saveFile.load().player)
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
  , draw: function(ctx) {
      Sprite.draw.call(this, ctx)
    }
  , pickSprite: function(core) {
      var getKey = core.input.getKey.bind(core.input)
      var mirroredLastTime = this.sprite.mirror

      if(this.__lastGroundCollisionSides.indexOf('bottom') > -1)
        this.sprite = sprites.get('char_indoor_stand')
      else
        this.sprite = sprites.get('char_indoor_stand')
        //this.sprite = sprites.get('char_c')

      this.sprite.mirror = (
        ( getKey(keys.RIGHT) && getKey(keys.LEFT) && this.dx > 0 )
      ||( !getKey(keys.RIGHT) && !getKey(keys.LEFT) && this.dx > 0 )
      ||( getKey(keys.RIGHT) && !getKey(keys.LEFT))
      ||( Math.abs(this.dx) < 0.01 && mirroredLastTime )
      )
    }
  , postPhysicsAndDamageHandler: function(core, stillCollidesWithMe) {
      var usable = _.filter(stillCollidesWithMe, function(obj) { return !!obj.use })
      if(!_.isEmpty(usable) && core.input.getKeyDown(keys.E)){
        closestTo.call(this, usable).use(this, core)
      }
      //if not moving, show ? or ... to show inspectabll
    }
  , respondToControllerIntent: function(core) {
      if(this.__lastGroundCollisionSides.indexOf('bottom') > -1) {
        if(core.input.getKey(keys.RIGHT)) {
          this.sprite.mirror = true
          this.dx += 0.02
        }
        else if(core.input.getKey(keys.LEFT)) {
          this.sprite.mirror = false
          this.dx -= 0.02
        }
        else { this.dx *= 0.9
          if(Math.abs(this.dx) < 0.01) { this.dx = 0 }
        }
      }
      else {
        if(core.input.getKey(keys.RIGHT)) {
          this.sprite.mirror = true
          this.dx += 0.005
        }
        else if(core.input.getKey(keys.LEFT)) {
          this.sprite.mirror = false
          this.dx -= 0.005
        }
        else {
          this.dx *= 0.99
          if(Math.abs(this.dx) < 0.01) { this.dx = 0 }
        }
      }

      if(core.input.getKeyDown(keys.SPACE)) {
        if(this.__lastGroundCollisionSides.indexOf('bottom') > -1) {
          this.dy = -0.15
        }
      }
      if(core.input.getKey(keys.SPACE)) {
        this.dy -= 0.005
        this.maxDy = 0.1
      }
      else {
        this.maxDy = 0.2
      }

      if(core.input.getKeyDown(keys.F)) {
        this.currentWeapon && this.currentWeapon.fire(core)
      }
    }
  }
)
