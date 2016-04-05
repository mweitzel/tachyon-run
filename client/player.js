var _ = require('lodash')
  , keys = require('./keys')
  , sprites = require('./all-sprites')
  , collider = require('./collider')
  , closestTo = collider.objClosestTo
  , saveFile = require('./save-file')
  , zIndex = require('./layer-z-defaults').player
  , dynamicWeapon = require('./dynamic-weapon')
  , drawHUD = require('./player-hud')
  , onDeath = require('./player-on-death')
  , wordDirections = require('./word-directions')
  , audioSpritePlayer = require('./audio-sprite-player')
  , addTemporaryParticle = require('./add-temporary-particle')
  , probMixin = require('improbable')
  , probably = probMixin.probably.bind(probMixin)

module.exports = Player

function Player(attrs) {
  _.merge(this, saveFile.load().player)
  _.merge(this, attrs)
  this.name = 'player'
  this.team = 'player'

  this.__defineSetter__('currentAction', function(ca) {
    this.__previousAction = this.__currentAction
    this.__currentAction = ca

  })
  this.__defineGetter__('currentAction', function() { return this.__currentAction })

  this.currentAction = 'stand'
  this.sprite = sprites.get('null')
  this.sprite = sprites.get('char_indoor_stand')
  this.__defineGetter__('spriteX', function() { return this.x - 16 })
  this.__defineGetter__('spriteY', function() { return this.y - 32 })
  this.resetWeapon()
}

var PE = require('./playable-entity')
  , beget = require('../beget')

function _setSpriteIfDiffersAnd(obj, name) {
  if(obj.sprite && obj.sprite.name !== name) {
    obj.sprite = sprites.get(name)
  }
}

function minSlideDuration(core) {
  return core.physicsTimeStep * 17
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
      stand: function() {    return [this.x-4, this.y-24,  8, 24] }
    , land: function() {     return [this.x-4, this.y-21,  8, 21] }
    , airdodge: function() { return [this.x-4, this.y-18,  8, 12] }
    , slide: function() {    return [this.x-8, this.y-14, 16, 14] }
    , duck: function() {     return [this.x-4, this.y-15,  8, 15] }
    }
  , aliasedBounds: {
      jump: 'stand'
    , fall: 'stand'
    , run: 'stand'
    , cut: 'land'
    , airslide: 'slide'
    }
  , pickSprite: function(core) {
      var mirroredLastTime = this.sprite.mirror

      var spriteName = this.currentIdentifier()

      if(this.currentAction === 'jump') {
        if(!core.input.getKey(keys.X)) {
          this.sprite.fps = 14
        }
      }

      _setSpriteIfDiffersAnd(this, spriteName)

      this.sprite.mirror = mirroredLastTime
      this.sprite.mirror = this.isFacingRight(core)
    }
  , onNewCurrentAction: function(core) {
      var currentId = this.currentIdentifier()
      if(this.currentAction !== this.__previousAction){


        this.emitSound(currentId)
        if(currentId === this.currentIdentifier.call({currentAction: 'land'})) {
          probably(0.5, emitRightDust)(core, this)
          probably(0.5, emitLeftDust)(core, this)
        }
        if(currentId === this.currentIdentifier.call({currentAction: 'cut'})) {
          var intent = this.controllerLeftRightIntent(core)

          if(probably(0.5) && intent === 'right') { emitLeftDust(core, this) }
          if(probably(0.5) && intent === 'left') { emitRightDust(core, this) }
        }
      }

      function emitRightDust(core, locationObj) {
        addTemporaryParticle(
          'landing_dust_a'
        , core
        , {  x: locationObj.x + 2
          ,  y: locationObj.y - 2
          , dx: locationObj.dx + 0.2 + 0.1*(Math.random())
          , dy: -0.1*Math.random()
          , removeAfter: 200 + 200*Math.random()
          , mirrorSprite: true }
        )
      }
      function emitLeftDust(core, locationObj) {
        addTemporaryParticle(
          'landing_dust_a'
        , core
        , {  x: locationObj.x - 2
          ,  y: locationObj.y - 2
          , dx: (locationObj.dx - 0.2) - 0.1*(Math.random())
          , dy: -0.1*Math.random()
          , removeAfter: 200 + 200*Math.random() }
        )
      }
    }
  , emitSound: function(audioSpriteId) {
        if(!!audioSpritePlayer.trackData(audioSpriteId)) {
          audioSpritePlayer.play(audioSpriteId)
          return true
        }
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
  , controllerLeftRightIntent: function(core) {
      if(
        (core.input.getKey(keys.RIGHT) && !core.input.getKey(keys.LEFT))
      ||(  (core.input.getKey(keys.RIGHT) && core.input.getKey(keys.LEFT))
         &&(core.input.downAt(keys.RIGHT) >  core.input.downAt(keys.LEFT))
        )
      ) {
        return 'right'
      }
      if(
        (core.input.getKey(keys.LEFT) && !core.input.getKey(keys.RIGHT))
      ||(  (core.input.getKey(keys.LEFT) && core.input.getKey(keys.RIGHT))
         &&(core.input.downAt(keys.LEFT) >  core.input.downAt(keys.RIGHT))
        )
      ) {
        return 'left'
      }
    }
  , postPhysicsAndDamageHandler: function(core, stillCollidesWithMe) {
      var usable = _.filter(stillCollidesWithMe, function(obj) { return !!obj.use })
      var lookingAt = _.filter(usable, function(obj) {
        if(this.isFacingLeft(core))
          return obj.x < this.x
        else
          return obj.x > this.x
      }.bind(this))
      if(  this.__onGroundLastFrame(core)
        && !_.isEmpty(usable)
        && !(core.input.getKey(keys.LEFT) || core.input.getKey(keys.RIGHT))
        && core.input.getKeyDown(keys.DOWN)
      ){
        this.dx = 0
        this.dy = 0
        this.currentAction = 'stand'
        ;(closestTo.call(this, lookingAt)
        ||closestTo.call(this, usable)
        ).use(this, core)
      }
      //if not moving, show ? or ... to show inspectabll

      if(this.__bumpedHeadLastFrame(core)) {
        this.emitSound('hit_head')
        ;['a','b','c'].map(function(suffix) { return 'mini_star_'+suffix })
        .map(function(spriteName) { return [ spriteName, core, generateXYObj(this) ]}.bind(this))
        .forEach(function(args) { addTemporaryParticle.apply(null, args) })
      }

      function generateXYObj(player) {
        return {   x: player.x
                ,  y: player.bounds()[1]
                , dx: (Math.random() - 0.5)
                , dy: (Math.random() - 0.5)
                , removeAfter: 350 }
      }
    }
  , __onGroundLastFrame: function(core) {
      return this.__lastGroundCollisionSides && (this.__lastGroundCollisionSides.indexOf('bottom') > -1)
    }
  , __bumpedHeadLastFrame: function(core) {
      return this.__lastGroundCollisionSides && (this.__lastGroundCollisionSides.indexOf('top') > -1)
    }
  , respondToControllerIntent: function(core) {
      var onGroundLastFrame = this.__onGroundLastFrame(core)
      this.canBeginSlide = this.canBeginSlide || onGroundLastFrame
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
      if( this.__shouldSlide(core) ) {
        if(!onGroundLastFrame || this.dy < 0) {
          if(core.input.getKey(keys.UP)
            && this.__dodgeBeginTime + maxSlideDuration(core) > core.lastUpdate
            )
            this.currentAction = 'airdodge'
          else {
            this.currentAction = ( Math.abs(this.dx) < this.maxDx * 0.55
              &&  !(core.input.getKey(keys.LEFT) || core.input.getKey(keys.RIGHT))
              )
              ? 'duck'
              : 'airslide'
          }
        }
        else {
          this.currentAction = Math.abs(this.dx) < this.maxDx * 0.55
          ? 'duck'
          : 'slide'
        }
        if(onGroundLastFrame) {
          if(this.__mustStillSlide(core)) {
            if(Math.abs(this.dx) < 0.5 * this.maxDx
            && this.__headWouldCollideWithGroundBlock(core)
            ) {
              var ddx = 0
              core.input.getKey(keys.RIGHT) && (ddx += 0.51*this.maxDx)
              core.input.getKey(keys.LEFT)  && (ddx -= 0.51*this.maxDx)
              this.dx += ddx
            }
          }
          else {
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
        if(onGroundLastFrame) {
          var leftOrRight = this.controllerLeftRightIntent(core)
          if(leftOrRight === 'right') {
            this.sprite.mirror = true
            this.dx += 0.02
          }
          else if(leftOrRight === 'left') {
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
          if(onGroundLastFrame) {
            this.dy = -this.jumpVelocity
            var x = 0

            if(this.__jumpOutOfPipeClearsSlide(core)) {
              this.__dodgeBeginTime = 0
              while(!(
                x >= 8 || !this.__headWouldCollideWithGroundBlock(core)
              )) {
                this.x += Math.sign(this.dx)
                x++
              }
            }
          }
        }
        if(core.input.getKey(keys.X)) {
          this.dy -= 0.005
          this.maxDy = 0.1
        }
        else {
          this.maxDy = 0.2
        }

        if(!onGroundLastFrame) {
          this.currentAction = this.dy < 0 && this.canBeginSlide
          ? 'jump' : 'fall'
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
          else if(
            Math.abs(this.dx) > 0.00001
          || (this.currentAction === 'cut' && this.controllerLeftRightIntent(core))
          ) {
            if((Math.abs(this.dx) >= this.maxDx*0.25
                && ((this.dx < 0 && this.controllerLeftRightIntent(core) === 'right')
                  || (this.dx > 0 && this.controllerLeftRightIntent(core) === 'left')
                 )
               )
            || (this.currentAction === 'cut'
                && this.sprite.startTime + this.sprite.loopDuration() > core.lastUpdate
               )
            ) {
              this.currentAction = 'cut'
            }
            else {
              this.currentAction = Math.abs(this.dx) > 0.2*this.maxDx
              ? 'run'
              : 'stand'
            }
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
          else if(lastAirborn
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
  , triggerTriggers: function(core, collidingObjects) {
      collidingObjects.forEach(function(obj) {
        obj.trigger && obj.trigger(core, this)
      }.bind(this))
    }
  }
, {
    __shouldSlide: function (core) {
      return (
        ( this.__mustStillSlide(core) )
      ||( this.__canStillSlide(core) && core.input.getKey(keys.Z))
      ) && !(
          this.__jumpOutOfPipeClearsSlide(core)
      )
    }
  , __jumpOutOfPipeClearsSlide: function(core) {
      return core.input.getKeyDown(keys.X) && this.__hangingOffAnEdge(core) //&& this.dx != 0
    }
  , __mustStillSlide: function(core) {
      return (
        this.__dodgeBeginTime + minSlideDuration(core) > core.lastUpdate
        || this.__headWouldCollideWithGroundBlock(core)
      )
    }
  , __headWouldCollideWithGroundBlock: function(core) {
      var phoCollider = {
        x: this.x
      , y: this.y
      , bounds: function() { return [this.x-1, this.y-18, 2, 4] }
      }
      return this.__givenColliderCollidesWithGroundBlock(phoCollider, core)
    }
  , __hangingOffAnEdge: function(core) {
      return this.__healsAreHangingOffEdge(core) || this.__toesAreHangingOffEdge(core)
    }
  , __healsAreHangingOffEdge: function(core) {
      if(!this.__onGroundLastFrame(core)) { return false }
      var facingRight = this.isFacingRight(core)
      var xOffset = facingRight ? -10 : 5
      var phoCollider = {
        x: this.x
      , y: this.y
      , bounds: function() { return [this.x+xOffset, this.y-18, 5, 20] }
      }
      return !this.__givenColliderCollidesWithGroundBlock(phoCollider, core)
    }
  , __toesAreHangingOffEdge: function(core) {
      if(!this.__onGroundLastFrame(core)) { return false }
      var facingRight = this.isFacingRight(core)
      var xOffset, width
      if(this.currentAction === 'slide') {
        xOffset = facingRight ? 8 : -10
        width = 2
      }
      else {
        xOffset = facingRight ? 5 : -10
        width = 5
      }
      var phoCollider = {
        x: this.x
      , y: this.y
      , bounds: function() { return [this.x+xOffset, this.y-18, width, 20] }
      }
      return !this.__givenColliderCollidesWithGroundBlock(phoCollider, core)
    }
  , __givenColliderCollidesWithGroundBlock: function(phoCollider, core) {
      return core.tileMap
        .getOthersNear(phoCollider)
        .filter(collider.collidesWith.bind(phoCollider))
        .filter(function(obj) { return obj.layer === 'ground' })
        .length >= 1
    }
  , __canStillSlide: function(core) {
      return (
        this.__dodgeBeginTime + maxSlideDuration(core) > core.lastUpdate
      ||( Math.abs(this.dx) < this.maxDx * 0.55
        && core.input.getKey(keys.Z)
        )
      ||this.__onGroundLastFrame(core)
      )
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
  if(core.input.getKey(keys.LEFT)) {
    this.sprite.mirror = false
    this.dx -= 0.005
  }
  if(
    !(core.input.getKey(keys.LEFT) || core.input.getKey(keys.RIGHT))
//  || core.input.getKey(keys.Z)
  ) {
    this.dx *= 0.99
    if(Math.abs(this.dx) < 0.01) { this.dx = 0 }
  }
}
