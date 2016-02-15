var domready = require('domready')

if(!module.parent) {
  domready(function() {
    require(
      '../../client/game-main.js'
    ).apply(this, arguments)
  })
}
