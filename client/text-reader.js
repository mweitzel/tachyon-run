var keys = require('./keys')
  , partialCharProgresser = require('../text-less')
  , wordWrap = require('../text-formatter')
  , Menu = require('./base-menu')
  , Rstring = require('./renderable-string')
  , colors = require('./colors')
  , readers = require('./dialogues').readers
  , floatWithin = require('./float-within')
  , pad = require('./inner-pad')
  , config = require('./config')
  , delegate = require('../delegate-with-transform')
  , fullStopSequences = [' \n', '  ']

module.exports = Reader

function Reader(core, readerTextName, fillRegion) {
  if(!fillRegion) {
    fillRegion = [0,0,core.context.width,core.context.height/2]
  }
  this.core = core
  this.border = true

  var maxCharsPerLine = Math.floor(
    (fillRegion[2] - config.tileSize*2)/config.textCharWidth
  )
  var maxLines = Math.floor(
    (fillRegion[3] - config.tileSize*2)/config.textCharHeight
  )

  var contentWindow = {
    width: maxCharsPerLine * config.textCharWidth
  , height: maxLines * config.textCharHeight
  }

  var contentTopLeft = floatWithin(
    fillRegion
  , ['middle']
  , contentWindow
  )

  contentWindow.x = contentTopLeft.x
  contentWindow.y = contentTopLeft.y

  this.text = readers[readerTextName]
  this.formattedText = wordWrap(this.text, maxCharsPerLine)

  this.rstring = new Rstring('')
  this.rstring.backgroundColor = colors.transparent
  this.rstring.x = contentWindow.x    //innerBox[0]
  this.rstring.y = contentWindow.y    //innerBox[1]

  delegate(this, contentWindow, 'x', function(x) { return x - config.menuBorderSize })
  delegate(this, contentWindow, 'y', function(y) { return y - config.menuBorderSize })
  delegate(this, contentWindow, 'width', function(w) { return w + 2*config.menuBorderSize })
  delegate(this, contentWindow, 'height', function(h) { return h + 2*config.menuBorderSize })
  this.renderer = partialCharProgresser(this.formattedText, maxLines)
  core.priorityStack.push(this)
RRR = this
}

function paddedFullRegion(ctx) {
  return pad([0,0,ctx.width, ctx.height], config.tileSize)
}

function padMenuBorder(bounds) {
  return pad(bounds, config.menuBorderSize)
}

Reader.prototype = {
  update: function(core) {
    this.__lastCharacterExposedAt = this.__lastCharacterExposedAt || core.lastUpdate
    if(this.automaticallyDisplayNextChar(core)
    || this.deliberatelyDisplayNextChar(core)
    ) {
      this.renderer = this.renderer.proceed()
      this.rstring.string = this.renderer.text
      this.__lastCharacterExposedAt = core.lastUpdate
    }
    if(this.renderer.done
    && core.input.getKeyDown(keys.SPACE)
    ) { this.exit(core) }
  }
, automaticallyDisplayNextChar: function(core) {
    return !this.fullStop()
    && (
       config.textFrameDelay*core.physicsTimeStep <= core.lastUpdate - this.__lastCharacterExposedAt
    || (
       config.textFrameDelay*core.physicsTimeStep/3 <= core.lastUpdate - this.__lastCharacterExposedAt
      && core.input.getKey(keys.SPACE)
      )
    )
  }
, fullStop: function() {
    return !!fullStopSequences.find(function(sq) {
      return endsWith.call(this.renderer.proceed().text, sq)
    }.bind(this))
  }
, deliberatelyDisplayNextChar: function(core) {
    return core.input.getKeyDown(keys.SPACE)
  }
, shouldDefaultProgress: function(core) {

  }
, exit: function(core) {
    core.removePriorityObj(this)
  }
, draw: Menu.prototype.drawMenu
}

function endsWith(string) {
  return this.slice(-string.length) === string
}
