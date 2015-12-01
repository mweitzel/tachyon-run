var removeAfter = require('./remove-obj-after-time')
  , DynamicCollider = require('./dynamic-collider')
  , sprites = require('./all-sprites')
  , Sprite = require('./sprite')
  , _ = require('lodash')
  , delay = 1000
  , zIndex = require('./layer-z-defaults').projectile

module.exports = spawnProjectile

function spawnProjectile(core, options) {
  var projectile = new Projectile()
  projectile.z = zIndex
  projectile.dx = (0.5 - Math.random())
  projectile.dy = (- Math.random()) * 0.2
  projectile.sprite = sprites.get('dummy')
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
Projectile.prototype = DynamicCollider.prototype
