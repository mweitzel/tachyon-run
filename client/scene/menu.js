var Menu = require('../base-menu')
  , follow = require('../follow')
  , boundHelper = require('../bounds-helper')
  , layers = require('../layer-z-defaults')
  , loadLevelPieces = require('../serialized-level-data-to-game-objects')

module.exports = function(core) {
  var menu = new Menu(
    core
  , { border: true, isBackgroundObject: true }
  , {
      'new game': noop
    , continue: noop
    , settings: noop
    , "editor": function() {
        core.sceneLoader.load('level-editor')
      }
    }
  ).float(['middle'])

  loadLevelPieces('menu').forEach(function(levelPiece) {
    core.entities.push(levelPiece)
  })
}

function noop() {}
