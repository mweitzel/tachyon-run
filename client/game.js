var Core = require('./core')
  , SceneLoader = require('./scene-loader')

module.exports = function(canvasElement) {
  var ctx = canvasElement.getContext('2d')
  ctx.width = canvasElement.width
  ctx.height = canvasElement.height
  var core = new Core(this, ctx)
  core.sceneLoader = new SceneLoader(core)
  core.sceneLoader.load('menu')
}
