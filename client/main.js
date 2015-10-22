var requires = {
  _: require('lodash')
, game: require('./game.js')
, canvasProps: require('../canvas-properties')
}
module.exports = main

function main(injected) {
  var injected = injected || {}
    , r = requires._.merge(requires, injected)
    , canvas = this.document.getElementById(r.canvasProps.id)
  r.game.call(this, canvas)
  console.log('loaded')
}
