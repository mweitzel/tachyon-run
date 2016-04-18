var Core = require('./core')
  , SceneLoader = require('./scene-loader')
  , debug = require('./development-debug-expose-globals')
  , loadLevelPieces = require('./serialized-level-data-to-game-objects')
  , loadPlayableFromEditorEntities = require('./load-playable-level-from-editor-entities')

module.exports = function(canvasElement) {
  var ctx = canvasElement.getContext('2d')
  ctx.width = canvasElement.width
  ctx.height = canvasElement.height
  var core = new Core(this, ctx)
  core.sceneLoader = new SceneLoader(core)
  core.loadPlayableFromEditorEntities = loadPlayableFromEditorEntities
  core.loadLevelByName = function(levelName) {
    core.loadPlayableFromEditorEntities(
      core
    , loadLevelPieces(levelName)
    )
  }

  //core.sceneLoader.load('level-editor')
  core.loadLevelByName('test')

  debug.exposeCore(core)
  debug.exposeLodash()
  debug.exposeWhatever && debug.exposeWhatever()
}
