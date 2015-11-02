var _ = require('lodash')
  , Sprite = require('./sprite-preconfigured')
  , atlasIndex = require('./sprite-atlas-index.js')
  , getSpriteNames = require('./sprite-name-prefixes')
  , spriteNames = getSpriteNames(Object.keys(atlasIndex.frames))
  , sprites = (function () {
      return spriteNames.map(function(name) {
        return new Sprite(name)
      })
    })()
  , collider = require('./collider')
  , StaticCollider = require('./static-collider')
  , keys = require('./keys')

module.exports = Player

function Player(attrs) {
  _.merge(this, attrs)
  this.sprite = _.find(sprites, {name: 'char_c'})
}

Player.prototype = {
  collidable: true
, dynamic: true
, hasMoved: true
, bounds: function() {
    return [this.x-8, this.y-24, 16, 24]
  }
, dy: 0
, dx: 0
, x: 0
, y: 0
, get spriteX() { return this.x - 16 }
, get spriteY() { return this.y - 32 }
, update: function(core) {
    respondToInput.call(this, core)
    applyGravity.call(this)
    applySpeedCaps.call(this)

    applyPhysicsStep(core, this)
  }
, draw: Sprite.draw
, drawDebug: StaticCollider.prototype.drawDebug
, squidgedBoundsForDebugDraw: StaticCollider.prototype.squidgedBoundsForDebugDraw
}

function respondToInput(core) {
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

function applyGravity() {
  this.dy += 0.01
}

function respondToGroundCollisions(ground) {
  var gBounds = _.map(ground, function(g) { return g.bounds() })
  var sides = _.map(gBounds, collider.collidingSide.bind(null, this.bounds()))
  if( sides.indexOf('left') > -1) { this.dx = 0 }
  if( sides.indexOf('right') > -1) { this.dx = 0 }
  if( sides.indexOf('bottom') > -1) { this.dy = 0 }
  if( sides.indexOf('top') > -1) { this.dy = 0 }
  this.__lastGroundCollisionSides = sides
}

function applySpeedCaps() {
  if(this.dx > 0.1) { this.dx = 0.1 }
  if(this.dx < -0.1) { this.dx = -0.1 }
  if(this.dy > 0.2) { this.dy = 0.2 }
  if(this.dy < -0.2) { this.dy = -0.2 }
}

function incrementCoords(obj, stepSize) {
  obj.x += obj.dx * stepSize
  obj.y += obj.dy * stepSize
}

function applyPhysicsStep(core, obj) {
  incrementCoords(obj, core.physicsTimeStep)

  var collidesWithObj = collider.playerShouldRespondTo.bind(null, obj)
  var allEntitiesToRespondTo = _.filter(core.entities , collidesWithObj)
  var ground = _.filter( allEntitiesToRespondTo , { layer: 'ground' })

  var collidingGround = _.find(ground, collidesWithObj)

  var backstepRate = 0.1
  var backSteps = 0
  while(collidingGround && backSteps <= 1/backstepRate) {
    backSteps++
    collidingGround = _.find(ground, collidesWithObj)
    incrementCoords(obj, -core.physicsTimeStep * backstepRate)
  }
  respondToGroundCollisions.call(obj, ground)

  incrementCoords(obj, core.physicsTimeStep * backstepRate * backSteps)
}

