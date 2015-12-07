var Menu = require('../base-menu')
  , follow = require('../follow')
  , boundHelper = require('../bounds-helper')

module.exports = function(core) {
  var menu = new Menu(
    core
  , { border: true, isBackgroundObject: true }
  , {
      'new game': noop
    , continue: noop
    , settings: noop
    }
  ).float(['middle'])
}

function noop() {}
