var _ = require('lodash')
  , collider = require('./collider')
  , applyPhysics = require('./apply-physics')
  , spyReturns = require('../tee-callback')
  , StaticCollider = require('./static-collider')

module.exports = Playable

function Playable() {

}

function applyGravity() {
  this.dy += 0.01
}

function applySpeedCaps() {
  if(this.dx > this.maxDx) { this.dx = this.maxDx }
  if(this.dx < this.minDx) { this.dx = this.minDx }
  if(this.dy > this.maxDy) { this.dy = this.maxDy }
  if(this.dy < this.minDy) { this.dy = this.minDy }
}

Playable.prototype = {
  collidable: true
, x: 0
, y: 0
, dx: 0
, dy: 0
, maxDx: 0.1
, minDx: -0.1
, maxDy: 0.2
, minDy: -0.2
, width: 8
, height: 8
, bounds: function() {
    return [this.x - this.width/2, this.y - this.height/2, this.width, this.height]
  }
, drawDebug: StaticCollider.prototype.drawDebug
, squidgedBoundsForDebugDraw: StaticCollider.prototype.squidgedBoundsForDebugDraw
, gravityConstant: 1
, respondToControllerIntent: function() {}
, damagesMe: function(obj) {
    if(typeof obj.team === 'undefined'
    || obj.team === 'neutral'
    || this.team === obj.team )
      return false
    else
      // hostile or other team
      return true
  }
, update: function(core) {
    this.respondToControllerIntent(core)

    applyGravity.call(this)

    applySpeedCaps.call(this)

    var spy = []
    applyPhysics(
      core.physicsTimeStep
    , this
    , spyReturns(spy, this.findEntitiesToRespondTo.bind(this, core))
    )

    core.tileMap.cache(this)

    var stillCollidesWithMe = _.filter(
      spy.pop()
    , collider.collidesWith.bind(this)
    )

    _.forEach(
        _.filter(
          stillCollidesWithMe
        , this.damagesMe.bind(this)
        )
    , receiveDamageFrom.bind(this)
    )

    this.postPhysicsAndDamageHandler(stillCollidesWithMe)
  }
, findEntitiesToRespondTo: function(core) {
    return _.filter(
      core.tileMap.getOthersNear(this)
    , collider.defaultShouldRespond.bind(this)
    )
  }
, postPhysicsAndDamageHandler: function(core, stillCollidesWithMe) { }
}

function receiveDamageFrom(other) { }
