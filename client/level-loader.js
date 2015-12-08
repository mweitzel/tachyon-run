var _ = require('lodash')

module.exports = function(core, recursiveSerializedToGOFn, levelName, cb) {
  var persisted = _.filter(core.entities, { persistLevelLoad: true })
  core.sceneLoader.load('blank', function() {
    recursiveSerializedToGOFn(levelName).forEach(function(levelPiece) {
      core.entities.push(levelPiece)
    })
    persisted.forEach(function(levelPiece) {
      levelPiece.onLevelChange && levelPiece.onLevelChange(core)
      core.entities.push(levelPiece)
    })
    cb && cb(core)
  })
}
