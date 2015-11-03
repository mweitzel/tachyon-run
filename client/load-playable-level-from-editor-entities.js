var convertParsedToPlayable = require('./convert-parsed-level-data-to-playable')
  , Player = require('./player')
  , keys = require('./keys')
  , follow = require('./smooth-camera-follow')

module.exports = function loadPlayableLevel(core, editorEntities, cursor) {
  core.sceneLoader.load('blank', function(core) {
    var playable = convertParsedToPlayable(editorEntities)
    for(var i = 0; i < playable.length; i++){
      core.entities.push(playable[i])
    }

    var player = new Player(centerOfCursor(cursor))
    core.entities.push(player)
    follow.call(core.cameraCenter, player, 0, (player.height/2)-(core.cameraSize.y/3))

    core.entities.push({
      update: function(core) {
        if(core.input.getKey(keys.CTRL) && core.input.getKeyDown(keys.C)) {
          core.sceneLoader.load('level-editor')
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
