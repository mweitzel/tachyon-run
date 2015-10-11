var domready = require('domready')
  , main = require('../../client/main.js')

if(!module.parent) { domready(main) }
