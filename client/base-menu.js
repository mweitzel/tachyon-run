var keys = require('./keys')
  , config = require('./config')
  , colors = require('./colors')
  , follow = require('./follow')
  , Rstring = require('./renderable-string')
  , delegate = require('../delegate-with-transform')
  , menuBorder = require('./menu-border')
  , _ = require('lodash')
  , floatWithin = require('./float-within')

module.exports = Menu

function Menu(core, attrs, menuOptions) {
  _.merge(this, attrs) // top, left, width, height, modal, border, cancel
  if(this.isBackgroundObject) {
    core.entities.push(this)
    this.drawHUD = drawMenu
    this.exit = function() {}
  }
  else {
    core.priorityStack.push(this)
    this.draw = drawMenu
    this.exit = removeFromCore.bind(this, core)
  }

  this.x = 0
  this.y = 0
  this.coreContextWidth = core.context.width
  this.coreContextHeight = core.context.height
  this.rstring = new Rstring('')
  this.rstring.backgroundColor = colors.transparent
  this.width || delegate(this, this.rstring, 'width', function(w) { return w + 16 })
  this.height || delegate(this, this.rstring, 'height', function(h) { return h + 16})
  follow.call(this.rstring, this, 8, 8)

  this.menuOptions = _.clone(menuOptions)
  this.menuKeys = Object.keys(this.menuOptions)

  if(this.cancelText) {
    this.menuKeys.push(this.cancelText)
    this.menuOptions[this.cancelText] = (this.exit.bind(this))
  }

  this.index = 0
  this.updateRstring()
}

function removeFromCore(core) {
  core.removePriorityObj(this)
}

Menu.prototype = {
  set index(index) {
    this.__index = index + this.menuKeys.length
    this.__index = this.__index % this.menuKeys.length
    this.updateRstring()
  }
, get index() {
    return this.__index
  }
, updateRstring: function() {
    this.rstring.string = this.menuKeys.map(function(opt, i) {
      return this.index === i
      ? '> ' + opt + '  '
      : '  ' + opt + '  '
    }.bind(this)).join('\n')
    if(this.name) { this.rstring.string = [this.name, this.rstring.string].join('\n') }
  }
, performCurrentIndex: function() {
    var selection = this.menuOptions[this.menuKeys[this.index]]
    if(this.exitOnSelection) { this.exit() }
    selection.call(this)
  }
, update: function(core) {
    if(this.cancelText
    &&((core.input.getKey(keys.CTRL) && core.input.getKeyDown(keys.C))
        || core.input.getKeyDown(keys.ESCAPE)
      )
    ) {
      return this.exit()
    }
    if(core.input.getKeyDown(keys.DOWN)) {
      this.index++
    }
    if(core.input.getKeyDown(keys.UP)) {
      this.index--
    }
    if(core.input.getKeyDown(keys.ENTER)) {
      this.performCurrentIndex()
    }
  }
, float: function(directions) {
    _.merge(
      this
    , floatWithin(
        [ this.x, this.y, this.coreContextWidth, this.coreContextHeight ]
      , directions
      , this
      )
    )
    return this
  }
}

function drawMenu(ctx) {
    if(this.modal) {
      ctx.fillStyle = colors.menuModelBackgroundFade
      ctx.fillRect(this.x, this.y, ctx.width, ctx.height)
    }
    var mbs = config.menuBorderSize
    var menuBounds =  [this.x, this.y, this.width, this.height]
    ctx.fillStyle = colors.menuModelBackgroundFade
    ctx.fillRect.apply(ctx, menuBounds)
    ctx.fillRect.apply(ctx, menuBounds)
    ctx.fillRect.apply(ctx, menuBounds)
    this.rstring.draw(ctx)
    if(this.border) {
      menuBorder('circuit', menuBounds).draw(ctx)
    }
  }
