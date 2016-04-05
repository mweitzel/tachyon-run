var config = require('./config')
  , StaticCollider = require('./static-collider')
  , levelLoader = require('./level-loader')
  , Player = require('./player')
  , setupSmoothCamera = require('./set-up-smooth-camera-for-loaded-level-and-player')

module.exports = makePlayerLoaderFromScript

function makePlayerLoaderFromScript() {
  return new PlayerLoader(this.x, this.y)
}

function PlayerLoader(x, y) {
  this.x = x + (config.tileSize*0.5)
  this.y = y + config.tileSize
}

PlayerLoader.prototype = {
  update: function(core) {
    var maybeExistingPlayer = core.entities.find(
      function(ent) { return ent.name === 'player' }
    )
    if(maybeExistingPlayer) { core.removeEntity(maybeExistingPlayer) }

    var player = new Player({ x: this.x, y: this.y})
    core.entities.push(player)
    setupSmoothCamera(core, player)
    core.removeEntity(this)
  }
}
