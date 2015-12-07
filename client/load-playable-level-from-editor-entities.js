var convertParsedToPlayable = require('./convert-parsed-level-data-to-playable')
  , Player = require('./player')
  , keys = require('./keys')
  , follow = require('./smooth-camera-follow')
  , genBounds = require('./generate-encapsulating-bound')

module.exports = function loadPlayableLevel(core, editorEntities, cursor) {
  core.sceneLoader.load('blank', function(core) {
    var playable = convertParsedToPlayable(editorEntities)
    for(var i = 0; i < playable.length; i++){
      core.entities.push(playable[i])
    }

    var player = new Player(centerOfCursor(cursor))
    core.entities.push(player)

    var groundBounds = _.map(
        _.filter(core.entities, {layer:'ground'})
      , function(o) { return o.bounds() }
      )
    var bounds = genBounds(groundBounds)
    core.cameraCenter.follow = function(obj, offsetX, offsetY) {
      follow.call(core.cameraCenter, obj, offsetX, offsetY, bounds, core.cameraSize)
    }

    core.cameraCenter.follow(player, 0, -(player.height))

    core.entities.push({
      update: function(core) {
        if(core.input.getKey(keys.CTRL) && core.input.getKeyDown(keys.C)) {
          var followedObj = core.cameraCenter.__targetForSmoothFollow
          var xy = { x: followedObj.x, y: followedObj.y }
          core.sceneLoader.load('level-editor', function(core) {
            this.cursor.x = Math.round((xy.x-8)/16) * 16
            this.cursor.y = Math.round((xy.y-8)/16) * 16
          })
        }
        if(core.input.getKey(keys.SHIFT) && core.input.getKeyDown(keys[1])) {
          core.debug = !core.debug
        }
      }
    })
  })
}

function centerOfCursor(cursor) {
  return { x: cursor.x + 8, y: cursor.y + 8 }
}
