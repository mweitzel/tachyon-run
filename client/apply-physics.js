var _ = require('lodash')
  , collider = require('./collider')
var substeps = 10

module.exports = function(stepSize, object, getEntitiesToRespondToCB) {
  incrementCoords(object, stepSize)
  var allEntitiesToRespondTo = getEntitiesToRespondToCB()
  var ground = _.filter( allEntitiesToRespondTo , { layer: 'ground' })

  var count = 0
  var max = 4

  var collidingGround = closestCollidingObject(object, ground)
  object.__lastGroundCollisionSides = []

  while(collidingGround && count < max) {
    count++
    escapeProximity(object, collidingGround)
    collidingGround = closestCollidingObject(object, ground)
  }

  _.each(['x', 'y'], roundIfUnderThreshold.bind(object, 0.0001))
}

function escapeProximity(movable, stationary) {
  return applyEscapeVector(
    movable
  , collider.escapeVector(movable.bounds(), stationary.bounds())
  )
}

function closestCollidingObject(object, potentialColliders) {
  return _.first(
    _.sortBy(
      _.filter(potentialColliders, collider.collidesWith.bind(object))
    , collider.proximityTo.bind(object)
    )
  )
}

function roundIfUnderThreshold(threshold, attr) {
  if(Math.abs(Math.round(this[attr]) - this[attr]) < threshold) {
    this[attr] = Math.round(this[attr])
  }
}

function applyEscapeVector(object, escapeVector) {
  object.x += escapeVector[0]
  object.y += escapeVector[1]
  if(escapeVector[0]){
    if(escapeVector[0] > 0) {
      object.__lastGroundCollisionSides.push('left')
      object.dx = Math.max(0, object.dx)
    }
    else {
      object.__lastGroundCollisionSides.push('right')
      object.dx = Math.min(0, object.dx)
    }
  }
  else if(escapeVector[1]) {
    if(escapeVector[1] > 0) {
      object.__lastGroundCollisionSides.push('top')
      object.dy = Math.max(0, object.dy)
    }
    else {
      object.__lastGroundCollisionSides.push('bottom')
      object.dy = Math.min(0, object.dy)
    }
  }
}

function incrementCoords(obj, stepSize) {
  obj.x += obj.dx * stepSize
  obj.y += obj.dy * stepSize
}
