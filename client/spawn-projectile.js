var removeAfter = require('./remove-obj-after-time')
  , DynamicCollider = require('./dynamic-collider')
  , sprites = require('./all-sprites')
  , Sprite = require('./sprite')
  , _ = require('lodash')
  , delay = 200
  , zIndex = require('./layer-z-defaults').projectile
  , beget = require('../beget')
  , timedRemove = require('./remove-obj-after-time')

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
  var remover = removeAfter(core, projectile, delay)
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
Projectile.prototype.postPhysicsAndDamageHandler = function(core) {
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
  this.emitParticle(core, 'poof_a')
}
Projectile.prototype.emitParticle = function(core, spriteName) {
  var p = new Particle(spriteName, { x: this.x, y: this.y })
  core.entities.push(p)
  timedRemove(core, p, p.sprite.loopDuration())
}

function Particle(spriteName, options) {
  this.sprite = sprites.get(spriteName)
  this.x = options.x
  this.y = options.y
  this.spriteX = this.x - this.sprite.width/2
  this.spriteY = this.y - this.sprite.height/2
}
Particle.prototype.draw = Sprite.draw
