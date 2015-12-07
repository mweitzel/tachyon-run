var config = require('./config')
  , StaticCollider = require('./static-collider')

module.exports = makeDoorFromScript

function makeDoorFromScript(levelName, xString, yString) {
  var targetX = parseInt(xString)
  var targetY = parseInt(yString)
  return new Door(this.x, this.y, levelName, targetX, targetY)
}


function Door(x, y, levelName, targetX, targetY) {
  this.x = x
  this.y = y
  this.levelName = levelName
  this.targetX = targetX
  this.targetY = targetY
}

Door.prototype = {
  collidable: true
, bounds: function() { return [this.x, this.y, this.width, this.height] }
, width: config.tileSize
, height: config.tileSize
, use: enterDoor
, drawDebug: StaticCollider.prototype.drawDebug
, squidgedBoundsForDebugDraw: StaticCollider.prototype.squidgedBoundsForDebugDraw
}

function enterDoor(user, core) {
  console.log('going to level '+this.levelName)
  console.log('coords '+this.targetX+','+this.targetY)
}