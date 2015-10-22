var Core = require('./core')
  , SceneLoader = require('./scene-loader')

module.exports = function(canvasElement) {
  var ctx = canvasElement.getContext('2d')
  var core = new Core(this, ctx)
  core.sceneLoader = new SceneLoader(core)
  core.sceneLoader.load('menu')
}
