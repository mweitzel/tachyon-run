var _ = require('lodash')
  , collider = require('./collider')
var substeps = 10

module.exports = function(stepSize, object, getEntitiesToRespondToCB) {
  incrementCoords(object, stepSize)
  var allEntitiesToRespondTo = getEntitiesToRespondToCB()
  var ground = _.filter( allEntitiesToRespondTo , { layer: 'ground' })

  var timeReversed = reversePhysicsUntilDecollide(object, ground, stepSize, substeps)

  _.each(['x', 'y'], roundIfUnderThreshold.bind(object, 0.0001))

  respondToGroundCollisions.call(object, ground)

  incrementCoords(object, timeReversed)
}

function roundIfUnderThreshold(threshold, attr) {
  if(Math.abs(Math.round(this[attr]) - this[attr]) < threshold) {
    this[attr] = Math.round(this[attr])
  }
}

function reversePhysicsUntilDecollide(object, ground, maxReverseTime, substeps) {
  var backSteps = 0

  var collidingGround = _.find(ground, collider.collidesWith.bind(object))

  var backStepSize = maxReverseTime / substeps

  while(collidingGround && backSteps < substeps) {
    backSteps++
    collidingGround = _.find(ground, collider.collidesWith.bind(object))
    incrementCoords(object, -backStepSize)
  }

  return backSteps * backStepSize
}

function incrementCoords(obj, stepSize) {
  obj.x += obj.dx * stepSize
  obj.y += obj.dy * stepSize
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
