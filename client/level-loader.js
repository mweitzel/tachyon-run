module.exports = function(core, recursiveSerializedToGOFn, levelName, cb) {
  core.sceneLoader.load('blank', function() {
    recursiveSerializedToGOFn(levelName).forEach(function(levelPiece) {
      core.entities.push(levelPiece)
    })
    cb && cb(core)
  })
}
