var BaseMenu = require('./base-menu')
  , floatWithin = require('./float-within')
  , pad = require('./inner-pad')
  , _ = require('lodash')
  , config = require('./config')

module.exports = YesNo

function YesNo(core, questionText, successCallback, yesText, noText) {

  var menuAttrs = { name: questionText, cancelText: noText, border: true}
  var menuOptions = {}
  menuOptions[yesText] = function() {
    successCallback && successCallback.call(this)
    this.exit()
  }

  ;( new BaseMenu(core, menuAttrs, menuOptions)
  ).float(['middle', 'right'])
}
