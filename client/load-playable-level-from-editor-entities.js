var convertParsedToPlayable = require('./convert-parsed-level-data-to-playable')

module.exports = function loadPlayableLevel(core, editorEntities) {
  core.sceneLoader.load('blank', function(core) {
    var playable = convertParsedToPlayable(editorEntities)
    for(var i = 0; i < playable.length; i++){
      core.entities.push(playable[i])
    }
  })
}
