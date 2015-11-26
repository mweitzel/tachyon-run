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

  var menu = new BaseMenu(core, menuAttrs, menuOptions)

  _.merge(
    menu
  , floatWithin(
      pad(
        [ 0, 0, core.context.width, core.context.height ]
      , config.tileSize
      )
    , ['middle', 'right']
    , menu.rstring
    )
  )
}
