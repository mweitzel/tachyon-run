var BaseMenu = require('./base-menu')
  , floatWithin = require('./float-within')
  , pad = require('./inner-pad')
  , config = require('./config')
  , _ = require('lodash')

module.exports = function(core) {
  new BaseMenu(
    core
  , { name: 'You just died.', border: true, exitOnSelection: true }
  , {
      "try again": function() {}
    , "main menu": function() {}
    }
  ).float(['middle'])
}
