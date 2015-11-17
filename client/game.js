var Core = require('./core')
  , SceneLoader = require('./scene-loader')
  , debug = require('./development-debug-expose-globals')

module.exports = function(canvasElement) {
  var ctx = canvasElement.getContext('2d')
  ctx.width = canvasElement.width
  ctx.height = canvasElement.height
  var core = new Core(this, ctx)
  core.sceneLoader = new SceneLoader(core)
  core.sceneLoader.load('level-editor')

  debug.exposeCore(core)
  debug.exposeLodash()
  debug.exposeWhatever && debug.exposeWhatever()
}
