/*
collision chart

Trigger - only responds to Player
Player - includes projectiles that hit walls
Enemy  - includes projectiles that hit walls
p(player shots) - do not collide with walls
e(enemny shots) - do not collide with walls
Block


     responds to this

       T P E p e B |
     T x ! x x x x |
t    P x x ! x ! ! |
i    E x ! x ! x ! |
h    p x x x x x x |
s    e x x x x x x |
     B x x x x x x |
     --------------

players
  return unless this.collides
  core.entities
    where
       other.collidable
    && ( (this.hasMoved && other.isBlock)
       || other.isEnemy
       || other.isEnemyShot
       || other.isTrigger
       )
    && collides(this, other)

enemies
  return unless this.collides
  core.entities
    where
       other.collidable
    && ( (this.hasMoved && other.isBlock)
       || other.isPlayer
       || other.isPlayerShot
       )
    && collides(this, other)

  ---            -----
 |   |          |     |
 |   | -----    |    -+---
  --- |     |   |   | |   |
      |     |    ---+-    |
       -----        |     |
                     -----

*/

var _ = require('lodash')

module.exports = {
  collidesWith: collidesWith
, intersects: intersects
, collidingSide: collidingSide
, defaultShouldRespond: defaultShouldRespond
, escapeVector: escapeVector
, proximityTo: proximityTo
, objClosestTo: objClosestTo
, magnitude: magnitude
, distance: distance
}

function defaultShouldRespond(other) {
  return this.collidable
  && other.collidable
  && ( other.layer == 'ground'
    || ( this.team !== other.team )
    )
  && collidesWith.call(this, other)
}

function collidesWith(other) {
  return intersects(this.bounds(), other.bounds())
}

function collidingSide(subject, collider) {
  if(yOverlaps(subject, collider))
    return leftIsCloserThanRight(subject, collider) ? 'left' : 'right'
  if(xOverlaps(subject, collider))
    return topIsCloserThanBottom(subject, collider) ? 'top' : 'bottom'

  return closestSide(subject, collider)
}

function closestSide(subject, collider) {
  var distances = [
    topAbsDist
  , bottomAbsDist
  , leftAbsDist
  , rightAbsDist
  ].map(function(f) { return f(subject, collider) })
  return [
    'top'
  , 'bottom'
  , 'left'
  , 'right'
  ][distances.indexOf(Math.min.apply(Math, distances))]
}

function leftIsCloserThanRight(subject, collider) {
  return leftAbsDist(subject, collider) < rightAbsDist(subject, collider)
}

function topIsCloserThanBottom(subject, collider) {
  return topAbsDist(subject, collider) < bottomAbsDist(subject, collider)
}

function topAbsDist(subject, collider) {
  return absoluteDistance(subject[1], collider[1] + collider[3])
}

function bottomAbsDist(subject, collider) {
  return absoluteDistance(subject[1] + subject[3], collider[1])
}

function leftAbsDist(subject, collider) {
  return absoluteDistance(subject[0], collider[0] + collider[2])
}

function rightAbsDist(subject, collider) {
  return absoluteDistance(subject[0] + subject[2], collider[0])
}



function absoluteDistance(a, b) {
  return Math.abs(a - b)
}

function intersects(b1, b2) {
  return xOverlaps(b1, b2) && yOverlaps(b1, b2)
}

function xOverlaps(b1, b2) {
  return (
      ( b1[0] < b2[0] + b2[2] && b1[0] > b2[0] )                 // my left  is between their right and left
   || ( b1[0] + b1[2] < b2[0] + b2[2] && b1[0] + b1[2] > b2[0] ) // my right is between their right and left
   || ( b2[0] < b1[0] + b1[2] && b2[0] > b1[0] )                 // their left  is between my right and left
   || ( b2[0] + b2[2] < b1[0] + b1[2] && b2[0] + b2[2] > b1[0] ) // their right is between my right and left
   || ( b1[0] == b2[0] )                                         // left are same
   || ( b1[0] + b1[2] == b2[0] + b2[2] )                         // rights are same
  )
}

function yOverlaps(b1, b2) {
  return (
      ( b1[1] < b2[1] + b2[3] && b1[1] > b2[1] )                 // my bottom  is between their top and bottom
   || ( b1[1] + b1[3] < b2[1] + b2[3] && b1[1] + b1[3] > b2[1] ) // my top     is between their top and bottom
   || ( b2[1] < b1[1] + b1[3] && b2[1] > b1[1] )                 // their bottom is between my top and bottom
   || ( b2[1] + b2[3] < b1[1] + b1[3] && b2[1] + b2[3] > b1[1] ) // their top    is between my top and bottom
   || ( b1[1] == b2[1] )                                         // tops are same
   || ( b1[1] + b1[3] == b2[1] + b2[3] )                         // bottoms are same
  )
}

function escapeVector(b1, b2) {
  var possibleEscapes = _.sortBy(
    [
      [b2[0] - (b1[0] + b1[2]), 0]  // its left minus my right
    , [(b2[0] + b2[2]) - b1[0], 0]  // its right minus my left
    , [0, b2[1] - (b1[1] + b1[3])]  // its top minus my bottom
    , [0, (b2[1] + b2[3]) - b1[1]]  // its bottom minus my top
    ]
  , cheaterMagnitude
  )
  return possibleEscapes[0]
  function cheaterMagnitude(xy) { // because I know one of them will always be 0
    if(xy[0] === 0)
      return Math.abs(xy[1])
    return Math.abs(xy[0])
  }
}

function magnitude(xy) {
  return Math.sqrt(xy[0]*xy[0] + xy[1] * xy[1])
}

function objClosestTo(objs) {
  return _.first(
    _.sortBy(
      objs
    , proximityTo.bind(this)
    )
  )
}

function proximityTo(otherObj) {
  return distance(this.bounds(), otherObj.bounds())
}

function distance(b1, b2) {
  // this makes distance polymorphic
  // it works with both bounds and points
  // by extending points into tiny bounds
  if(b1.length < 4) { b1 = b1.concat(0,0,0,0) }
  if(b2.length < 4) { b2 = b2.concat(0,0,0,0) }
  return magnitude([
    (b1[0] + b1[2]/2) - (b2[0] + b2[2]/2)
  , (b1[1] + b1[3]/2) - (b2[1] + b2[3]/2)
  ])
}