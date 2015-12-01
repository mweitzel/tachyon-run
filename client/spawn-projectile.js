var removeAfter = require('./remove-obj-after-time')
  , DynamicCollider = require('./dynamic-collider')
  , sprites = require('./all-sprites')
  , Sprite = require('./sprite')
  , _ = require('lodash')
  , delay = 1000
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
  removeAfter(core, projectile, delay)
  return projectile
}

function Projectile() {}
Projectile.prototype = beget(DynamicCollider.prototype)
Projectile.prototype.postPhysicsAndDamageHandler = function(core) {
  this.emitContrailIfReady(core)
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

  var p = new Particle(this.contrailSprite, { x: this.x, y: this.y })
  var duration = null // should be specified on weapon?
  core.entities.push(p)
  timedRemove(core, p, duration || p.sprite.loopDuration())
  timedRemove(core, p, duration || p.sprite.loopDuration())
}

function Particle(spriteName, options) {
  this.sprite = sprites.get(spriteName)
  this.x = options.x
  this.y = options.y
  this.spriteX = this.x - this.sprite.width/2
  this.spriteY = this.y - this.sprite.height/2
}
Particle.prototype.draw = Sprite.draw
