var config = require('./config')
  , StaticCollider = require('./static-collider')
  , levelLoader = require('./level-loader')
  , setupSmoothCamera = require('./set-up-smooth-camera-for-loaded-level-and-player')

module.exports = makeDoorFromScript

function makeDoorFromScript(recursiveSerializedToGOFn, levelName, xString, yString) {
  var targetX = parseInt(xString)
  var targetY = parseInt(yString)
  return new Door(this.x, this.y, recursiveSerializedToGOFn, levelName, targetX, targetY)
}


function Door(x, y, recursiveSerializedToGOFn, levelName, targetX, targetY) {
  this.x = x
  this.y = y
  this.recursiveSerializedToGOFn = recursiveSerializedToGOFn
  this.levelName = levelName
  this.targetX = targetX
  this.targetY = targetY
}

Door.prototype = {
  collidable: true
, bounds: function() { return [this.x, this.y, this.width, this.height] }
, width: config.tileSize
, height: config.tileSize
, use: function(player, core) { enterDoor.call(this, this.recursiveSerializedToGOFn, player, core) }
, drawDebug: StaticCollider.prototype.drawDebug
, squidgedBoundsForDebugDraw: StaticCollider.prototype.squidgedBoundsForDebugDraw
}

function enterDoor(recursiveSerializedToGOFn, player, core) {
  levelLoader(core, recursiveSerializedToGOFn, this.levelName, function(core) {
    player.x = this.targetX + config.tileSize/2
    player.y = this.targetY + config.tileSize/2
    core.entities.push(player)
    setupSmoothCamera(core, player)
  }.bind(this)
  )
}