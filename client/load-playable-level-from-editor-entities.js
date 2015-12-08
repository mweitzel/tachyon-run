var converter = require('./convert-parsed-level-data-to-playable')
  , convertSerializedToGameObject = require('./serialized-level-data-to-game-objects')
  , convertParsedToPlayable = converter.bind(converter, convertSerializedToGameObject)
  , Player = require('./player')
  , keys = require('./keys')
  , setupSmoothCamera = require('./set-up-smooth-camera-for-loaded-level-and-player')

module.exports = function loadPlayableLevel(core, editorEntities, cursor) {
  core.sceneLoader.load('blank', function(core) {
    var playable = convertParsedToPlayable(editorEntities)
    for(var i = 0; i < playable.length; i++){
      core.entities.push(playable[i])
    }

    var player = new Player(centerOfCursor(cursor))
    core.entities.push(player)

    setupSmoothCamera(core, player)

    core.entities.push({
      update: function(core) {
        if(core.input.getKey(keys.CTRL) && core.input.getKeyDown(keys.C)) {
          var followedObj = core.cameraCenter.__targetForSmoothFollow
          var xy = { x: followedObj.x, y: followedObj.y }
          var centerCameraOnFollowedObj = function(core) {
            this.cursor.x = Math.round((xy.x-8)/16) * 16
            this.cursor.y = Math.round((xy.y-8)/16) * 16
          }
          if(this.__changedLevel || !followedObj) {
            core.sceneLoader.load('level-editor')
          }
          else {
            core.sceneLoader.load('level-editor', followedObj ? centerCameraOnFollowedObj : null)
          }
        }
        if(core.input.getKey(keys.SHIFT) && core.input.getKeyDown(keys[1])) {
          core.debug = !core.debug
        }
      }
    , persistLevelLoad: true
    , onLevelChange: function(core) {
        this.__changedLevel = true
      }
    })
  })
}

function centerOfCursor(cursor) {
  return { x: cursor.x + 8, y: cursor.y + 8 }
}
