var domready = require('domready')

if(!module.parent) {
  domready(function() {
    require(
      '../../client/main.js'
    ).apply(this, arguments)
  })
}
