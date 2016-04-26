var requires = {
  _: require('lodash')
, game: require('./game.js')
, canvasProps: require('../canvas-properties')
, fullscreen: require('./fullscreen')
}
module.exports = main

function main(injected) {
  if(this.location.pathname === '/demo') {
    var injected = injected || {}
      , r = requires._.merge(requires, injected)
      , canvas = this.document.getElementById(r.canvasProps.id)
    if(browserCompatible()) {
      requires.fullscreen.doubleClickToggle(canvas)
      r.game.call(this, canvas)
      console.log('game loaded')
    }
    else {
      canvas.classList.add('hidden')
      document.getElementById('browser-incompatibility').classList.remove('hidden')
    }
  }
}

function browserCompatible() {
  return isChrome()
}

function isChrome() {
  return !!window.chrome && !!window.chrome.webstore
}
