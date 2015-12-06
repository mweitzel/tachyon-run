var _ = require('lodash')
  , Sprite = require('./sprite-preconfigured')
  , keys = require('./keys')
  , sprites = require('./all-sprites')
  , closestTo = require('./collider').objClosestTo
  , saveFile = require('./save-file')
  , zIndex = require('./layer-z-defaults').player
  , dynamicWeapon = require('./dynamic-weapon')
  , drawHUD = require('./player-hud')
  , onDeath = require('./player-on-death')

module.exports = Player

function Player(attrs) {
  _.merge(this, saveFile.load().player)
  _.merge(this, attrs)
  this.team = 'player'
  this.sprite = sprites.get('char_c')
  this.sprite = sprites.get('char_indoor_stand')
  this.__defineGetter__('spriteX', function() { return this.x - 16 })
  this.__defineGetter__('spriteY', function() { return this.y - 20 })
  this.resetWeapon()
}

var PE = require('./playable-entity')
  , beget = require('../beget')

Player.prototype = _.merge(
  beget(PE.prototype)
, {
    z: zIndex
  , invincibleTimeAfterDamage: 500
  , bounds: function() {
      return [this.x-7, this.y-12, 14, 24]
    }
  , pickSprite: function(core) {
      var mirroredLastTime = this.sprite.mirror
      this.sprite = sprites.get('char_indoor_stand')
      this.sprite.mirror = mirroredLastTime

      this.sprite.mirror = this.isFacingRight(core)
    }
  , isFacingRight: function(core) {
      var getKey = core.input.getKey.bind(core.input)
      return (
        ( getKey(keys.RIGHT) && getKey(keys.LEFT) && this.dx > 0 )
      ||( !getKey(keys.RIGHT) && !getKey(keys.LEFT) && this.dx > 0 )
      ||( getKey(keys.RIGHT) && !getKey(keys.LEFT))
      ||( Math.abs(this.dx) < 0.01 && this.sprite.mirror )
      )
    }
  , isFacingLeft: function(core) {
      return !this.isFacingRight(core)
    }
  , directionsOfIntent: function(core) {
      if(core.input.getKey(keys.DOWN)) { return ['down'] }
      var dirs = []
      if(core.input.getKey(keys.LEFT)) { dirs.push('left') }
      if(core.input.getKey(keys.RIGHT)) { dirs.push('right') }
      if(dirs[0] === 'left' && dirs[1] === 'right') {
        dirs = this.isFacingRight(core) ? ['right'] : ['left']
      }
      if(core.input.getKey(keys.UP)) { dirs.push('up') }
      if(dirs.length === 0) {
        dirs.push(this.isFacingRight(core) ? 'right' : 'left')
      }
      return dirs
    }
  , postPhysicsAndDamageHandler: function(core, stillCollidesWithMe) {
      var usable = _.filter(stillCollidesWithMe, function(obj) { return !!obj.use })
      if(!_.isEmpty(usable) && core.input.getKeyDown(keys.E)){
        closestTo.call(this, usable).use(this, core)
      }
      //if not moving, show ? or ... to show inspectabll
    }
  , respondToControllerIntent: function(core) {
      if(this.__lastGroundCollisionSides && (this.__lastGroundCollisionSides.indexOf('bottom') > -1)) {
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

      if(core.input.getKey(keys.F)) {
        this.currentWeapon && this.currentWeapon.fire(core)
      }
    }
  }
, {
    computeUnusedMaterias: function() {
      return _.difference(
        Object.keys(this.materiaXP)
      , _.flatten(_.pluck(this.weaponsConfig, 'materia'))
      )
    }
  }
, {
    currentWeapon: null
  , getCurrentWeaponName: function() {
      return Object.keys(this.weaponsConfig)[0]
    }
  , resetWeapon: function() {
      this.currentWeapon = dynamicWeapon.create(
        this.materiaXP
      , this.getCurrentWeaponName()
      , this.weaponsConfig[this.getCurrentWeaponName()].materia
      , this
      )
    }
  }
, {
    drawHUD: drawHUD
  , onDeath: onDeath
  }
)
