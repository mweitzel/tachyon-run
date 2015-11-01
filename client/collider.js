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


module.exports = {
  collidesWith: function(other) {
    return intersect(this.bounds, other.bounds)
  }
, intersects: function(b1, b2) {
    return ((
        ( b1[0] <= b2[0] + b2[2] && b1[0] >= b2[0] )                 // my left  is between their right and left
     || ( b1[0] + b1[2] <= b2[0] + b2[2] && b1[0] + b1[2] >= b2[0] ) // my right is between their right and left
     || ( b2[0] <= b1[0] + b1[2] && b2[0] >= b1[0] )                 // their left  is between my right and left
     || ( b2[0] + b2[2] <= b1[0] + b1[2] && b2[0] + b2[2] >= b1[0] ) // their right is between my right and left
    ) && (
        ( b1[1] <= b2[1] + b2[3] && b1[1] >= b2[1] )                 // my bottom  is between their top and bottom
     || ( b1[1] + b1[3] <= b2[1] + b2[3] && b1[1] + b1[3] >= b2[1] ) // my top     is between their top and bottom
     || ( b2[1] <= b1[1] + b1[3] && b2[1] >= b1[1] )                 // their bottom is between my top and bottom
     || ( b2[1] + b2[3] <= b1[1] + b1[3] && b2[1] + b2[3] >= b1[1] ) // their top    is between my top and bottom
    ))
  }
}