var config = require('./../config')

module.exports = makePortalFromScript

function makePortalFromScript(xString, yString, user, core) {
  var targetX = parseInt(xString)
  var targetY = parseInt(yString)
  var portal = new Portal(this.x, this.y, targetX, targetY)
  portal.use(user, core)
}


function Portal(x, y, targetX, targetY) {
  this.x = x
  this.y = y
  this.targetX = targetX
  this.targetY = targetY
}

Portal.prototype = {
  use: function(player, core) { enterPortal.call(this, player, core) }
}

function enterPortal(player, core) {
  player.x = this.targetX + config.tileSize/2
  player.y = this.targetY + config.tileSize
}
