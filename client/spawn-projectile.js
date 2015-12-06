var removeAfter = require('./remove-obj-after-time')
  , DynamicCollider = require('./dynamic-collider')
  , Sprite = require('./sprite')
  , sprites = require('./all-sprites')
  , _ = require('lodash')
  , delay = 200
  , zIndex = require('./layer-z-defaults').projectile
  , beget = require('../beget')
  , timedRemove = require('./remove-obj-after-time')
  , config = require('./config')
  , Particle = require('./particle')
  , addTemporaryParticle = require('./add-temporary-particle')

module.exports = spawnProjectile

function spawnProjectile(core, options) {
  var projectile = new Projectile()

  projectile.emitContrailPeriod = options.emitContrailPeriod
  projectile.z = zIndex
  projectile.dx = (0.5 - Math.random())
  projectile.dy = (- Math.random()) * 0.2
  projectile.sprite = sprites.get(options.spriteName)
  projectile.width = projectile.sprite.width - 2
  projectile.height = projectile.sprite.height - 2
  projectile.damageDealt = 0

  projectile.maxDx = projectile.maxDy = 100
  projectile.minDx = projectile.minDy = -100
  // gen function to lift bounds to highest speed for that object

  projectile.__defineGetter__('spriteX', function() { return this.x - this.sprite.width/2 })
  projectile.__defineGetter__('spriteY', function() { return this.y - this.sprite.height/2 })

  projectile.draw = Sprite.draw
  Object.keys(options).forEach(function(key) {
    projectile[key] = options[key]
  })

  core.entities.push(projectile)
  var remover = removeAfter(core, projectile, options.lifeInMs)
  projectile.callJustBeforeTimeoutRemoval = function(core) {
    if(remover.deleteAfter - core.physicsTimeStep <= core.lastUpdate) {
      projectile.emitTimeoutParticle(core)
      projectile.callJustBeforeTimeoutRemoval = noop
    }
  }
  return projectile
}

function noop() {}

function Projectile() {}
Projectile.prototype = beget(DynamicCollider.prototype)
Projectile.prototype.postPhysicsAndDamageHandler = function(core, stillCollidesWithMe) {
  this.emitContrailIfReady(core)
  this.callJustBeforeTimeoutRemoval(core)
}
Projectile.prototype.emitContrailIfReady = function(core) {
  if(this.shouldEmitContrail(core)) { this.emitContrail(core) }
}
Projectile.prototype.shouldEmitContrail = function(core) {
  if(!this.emitContrailPeriod) { return false }
  this.__lastContailEmittedTime = this.__lastContailEmittedTime || 0
  return this.__lastContailEmittedTime + this.emitContrailPeriod < core.lastUpdate
}
Projectile.prototype.emitContrail = function(core) {
  this.__lastContailEmittedTime = core.lastUpdate
  this.emitParticle(core, this.contrailSprite)
}
Projectile.prototype.emitTimeoutParticle = function(core) {
  this.emitParticle(core, 'projectile_poof_a')
}
Projectile.prototype.emitParticle = function(core, spriteName) {
  addTemporaryParticle(spriteName, core, { x: this.x, y: this.y })
}

Projectile.prototype.dealtDamage = function(damage) {
  this.health = 0
  this.damageDealt += damage
}
Projectile.prototype.removeIfDead = function(core) {
  if(!this.isDead()) {
    return false
  }
  else {
    core.removeEntity(this)
    var spread = config.tileSize/2 * Math.sqrt(this.damageTypes.length)
    for(var i = 0; i < this.damageTypes.length; i++) {
      addTemporaryParticle(
        this.damageTypes[i]+'_hit'
      , core
      , this.randomPoint(spread)
      )
    }
    return true
  }
}
Projectile.prototype.randomPoint = function(scaler) {
  return {
    x: this.x + (Math.random() - 0.5) * scaler
  , y: this.y + (Math.random() - 0.5) * scaler
  }
}
