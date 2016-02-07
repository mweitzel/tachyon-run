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
  , wordDirections = require('./word-directions')

module.exports = Player

function Player(attrs) {
  _.merge(this, saveFile.load().player)
  _.merge(this, attrs)
  this.name = 'player'
  this.team = 'player'
  this.currentAction = 'stand'
  this.sprite = sprites.get('null')
  this.sprite = sprites.get('char_indoor_stand')
  this.__defineGetter__('spriteX', function() { return this.x - 16 })
  this.__defineGetter__('spriteY', function() { return this.y - 32 })
  this.resetWeapon()
}

var PE = require('./playable-entity')
  , beget = require('../beget')

function _setSprite(obj, name) {
  if(obj.sprite && obj.sprite.name !== name) {
    obj.sprite = sprites.get(name)
  }
}

function minSlideDuration(core) {
  return core.physicsTimeStep * 10
}

function maxSlideDuration(core) {
  return core.physicsTimeStep * 30
}

Player.prototype = _.merge(
  beget(PE.prototype)
, {
    z: zIndex
  , jumpVelocity: 0.15
  , currentAction: 'stand'
  , currentIdentifier: function() {
      return ['char_indoor', this.currentAction].join('_')
    }
  , invincibleTimeAfterDamage: 500
  , bounds: function() {
      var boundsKey = this.aliasedBounds[this.currentAction] || this.currentAction
      return (
        this.allbounds[boundsKey]
        || this.allbounds.stand
      ).call(this)
    }
  , allbounds: {
      stand: function() {    return [this.x-6, this.y-24, 12, 24] }
    , land: function() {     return [this.x-6, this.y-21, 12, 21] }
    , airdodge: function() { return [this.x-6, this.y-20, 12, 14] }
    , slide: function() {    return [this.x-9, this.y-14, 18, 14] }
    }
  , aliasedBounds: {
      jump: 'stand'
    , fall: 'stand'
    }
  , pickSprite: function(core) {
      var mirroredLastTime = this.sprite.mirror

      var spriteName = this.currentIdentifier()

      if(this.currentAction === 'jump') {
        if(!core.input.getKey(keys.X)) {
          this.sprite.fps = 14
        }
      }

      _setSprite(this, spriteName)

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
  , directionsOfIntent: function(core, allowDiagonalDown, rejectFacingAsIntent) {
      var dirs = []
      if(core.input.getKey(keys.LEFT)) { dirs.push('left') }
      if(core.input.getKey(keys.RIGHT)) { dirs.push('right') }
      if(dirs[0] === 'left' && dirs[1] === 'right') {
        dirs = this.isFacingRight(core) ? ['right'] : ['left']
      }
      if(core.input.getKey(keys.DOWN)) {
        dirs.push('down')
        if(!allowDiagonalDown) { return ['down'] }
      }
      if(core.input.getKey(keys.UP)) { dirs.push('up') }
      if(dirs.length === 0) {
        if(rejectFacingAsIntent) {}
        else { dirs.push(this.isFacingRight(core) ? 'right' : 'left') }
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
      var onGroundLastFrame = this.__lastGroundCollisionSides && (this.__lastGroundCollisionSides.indexOf('bottom') > -1)
      this.canBeginSlide = this.canBeginSlide || onGroundLastFrame
      var maxSlideDuration = 500
      if(core.input.getKeyDown(keys.Z) && this.canBeginSlide) {
        this.canBeginSlide = false
        this.__dodgeBeginTime = core.lastUpdate
        if(core.input.getKey(keys.UP)
        || core.input.getKey(keys.DOWN)
        || core.input.getKey(keys.RIGHT)
        || core.input.getKey(keys.LEFT)
        ) {
          var dirs = wordDirections.toVector(this.directionsOfIntent(core, true, true))
          this.dx += 1.75 * this.maxDx * dirs[0]
          this.dy += this.jumpVelocity * dirs[1]
        }
      }
      if(this.__shouldSlide(core)) {
        if(!onGroundLastFrame && core.input.getKey(keys.UP)) {
          this.currentAction = 'airdodge'
        }
        else {
          this.currentAction = 'slide'
        }
        if( onGroundLastFrame) {
          if( !this.__mustStillSlide(core) ) {
            this.dx *= 0.95
            this.dy *= 0.95
          }
        }
        else {
          leftRightAirControl.call(this, core)
          this.dy *= 0.95
        }
      }
      else {
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
          leftRightAirControl.call(this, core)
        }

        if(core.input.getKeyDown(keys.X)) {
          if(this.__lastGroundCollisionSides.indexOf('bottom') > -1) {
            this.dy = -this.jumpVelocity
          }
        }
        if(core.input.getKey(keys.X)) {
          this.dy -= 0.005
          this.maxDy = 0.1
        }
        else {
          this.maxDy = 0.2
        }

        if(this.__lastGroundCollisionSides && this.__lastGroundCollisionSides.indexOf('bottom') === -1) {
          this.currentAction = this.dy < 0 ? 'jump' : 'fall'
        }
        else {
          var lastAirborn = this.__lastAirborn||0
          var landSpriteDuration = sprites.get('char_indoor_land').loopDuration()
          var breathHeavySpriteDuration = sprites.get('char_indoor_breath_heavy').loopDuration()
          var breathLightSpriteDuration = sprites.get('char_indoor_breath_light').loopDuration()
          // should show landing sprite
          if(lastAirborn + landSpriteDuration
          > core.lastUpdate) {
            this.currentAction = 'land'
          }
          // should show heavy breathing sprite
          else if(lastAirborn
          + landSpriteDuration
          + (breathHeavySpriteDuration * 2)
          > core.lastUpdate
          && core.input.getKey(keys.X)
          ) {
            this.currentAction = 'breath_heavy'
          }
          // should show light breathing sprite
          else if((this.__lastAirborn||0)
          + landSpriteDuration
          + (breathHeavySpriteDuration * 2)
          + (breathLightSpriteDuration * 3)
          > core.lastUpdate) {
            this.currentAction = 'breath_light'
          }
          else {
            this.currentAction = 'stand'
          }
        }
      }

      if(core.input.getKey(keys.F)) {
        this.currentWeapon && this.currentWeapon.fire(core)
      }
    }
  }
, {
    __shouldSlide: function (core) {
      return (
        ( this.__mustStillSlide(core) )
      ||( this.__canStillSlide(core) && core.input.getKey(keys.Z))
      )
    }
  , __mustStillSlide: function(core) {
      return this.__dodgeBeginTime + minSlideDuration(core) > core.lastUpdate
    }
  , __canStillSlide: function(core) {
      return this.__dodgeBeginTime + maxSlideDuration(core) > core.lastUpdate
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
      var thiz = this
      var gunCenter = {
        team: thiz.team
      , get x() { return thiz.x + thiz.bounds()[2]/2 }
      , get y() { return thiz.y - thiz.bounds()[3]/2 }
      , directionsOfIntent: thiz.directionsOfIntent.bind(thiz)
      }
      this.currentWeapon = dynamicWeapon.create(
        this.materiaXP
      , this.getCurrentWeaponName()
      , this.weaponsConfig[this.getCurrentWeaponName()].materia
      , gunCenter
      )
    }
  }
, {
    drawHUD: drawHUD
  , onDeath: onDeath
  }
)

function leftRightAirControl(core) {
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
