var keys = require('./keys')
  , partialCharProgresser = require('../text-less')
  , wordWrap = require('../text-formatter')
  , Menu = require('./base-menu')
  , Rstring = require('./renderable-string')
  , colors = require('./colors')
  , floatWithin = require('./float-within')
  , pad = require('./inner-pad')
  , config = require('./config')
  , delegate = require('../delegate-with-transform')
  , fullStopSequences = [' \n', '  ']
  , halfStopSequences = ['.', ',']

module.exports = Reader

function Reader(core, readerText, fillRegion, onExit) {
  this.onExit = onExit
  if(!fillRegion) {
    fillRegion = paddedFullRegion(core.context)
  }
  fillRegion[2] = Math.max(fillRegion[2], config.tileSize*3)
  this.core = core
  this.border = true

  var maxCharsPerLine = Math.floor(
    (fillRegion[2] - config.menuBorderSize*2)/config.textCharWidth
  )
  var maxLines = Math.floor(
    (fillRegion[3] - config.menuBorderSize*2)/config.textCharHeight
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

  this.text = readerText
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
    && core.input.getKeyDown(keys.X)
    ) { this.exit(core) }
  }
, automaticallyDisplayNextChar: function(core) {
    var delay = config.textFrameDelay * (this.halfStop(core) ? 10 : 1)
    return !this.fullStop()
    && (
       delay*core.physicsTimeStep <= core.lastUpdate - this.__lastCharacterExposedAt
    || (
       delay*core.physicsTimeStep/3 <= core.lastUpdate - this.__lastCharacterExposedAt
      && core.input.getKey(keys.X)
      )
    )
  }
, halfStop: function(core) {
    return !!(
      halfStopSequences.find(function(sq) {
        return endsWith.call(this.renderer.text, sq)
      }.bind(this))
    ) && !core.input.getKeyDown(keys.X)
    && !this.preceedsFullStop()
  }
, preceedsFullStop: function() {
    return !!fullStopSequences.find(function(sq) {
      return endsWith.call(this.renderer.proceed().proceed().text, sq)
    }.bind(this))
  }
, fullStop: function() {
    return !!fullStopSequences.find(function(sq) {
      return endsWith.call(this.renderer.proceed().text, sq)
    }.bind(this))
  }
, deliberatelyDisplayNextChar: function(core) {
    return core.input.getKeyDown(keys.X)
  }
, shouldDefaultProgress: function(core) {

  }
, exit: function(core) {
    core.removePriorityObj(this)
    this.onExit && this.onExit(core)
  }
, draw: Menu.prototype.drawMenu
}

function endsWith(string) {
  return this.slice(-string.length) === string
}
