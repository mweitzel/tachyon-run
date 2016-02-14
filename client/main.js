var requires = {
  _: require('lodash')
, game: require('./game.js')
, canvasProps: require('../canvas-properties')
, fullscreen: require('./fullscreen')
, cssWatcher: require('./watch-scroll')
}
module.exports = main

function main(injected) {
  var injected = injected || {}
    , r = requires._.merge(requires, injected)
    , canvas = this.document.getElementById(r.canvasProps.id)

  requires.fullscreen.doubleClickToggle(canvas)
  requires.cssWatcher.watchScroll(this)

  r.game.call(this, canvas)
  console.log('loaded')
}
