var zIndex = require('./layer-z-defaults').prompt
  , _ = require('lodash')
  , keys = require('./keys')
  , Rstring = require('./renderable-string')
  , follow = require('./follow')
  , delegate = require('../delegate-with-transform')
  , colors = require('./colors')
  , codeToChar = require('./key-code-to-character')

module.exports = Prompt

function Prompt(text, submitCB, cancelCB, alwaysCB) {
  this.x = 0
  this.y = 0
  this.promptText = text
  this.submitCB = submitCB
  this.cancelCB = cancelCB
  this.alwaysCB = alwaysCB
  this.rstring = new Rstring('')
  this.updatePromptText()
  delegate(this, this.rstring, 'width')
  delegate(this, this.rstring, 'height')
  this.backgroundColor = colors.textBackground
}

Prompt.prototype = {
  z: zIndex
, enteredText: ''
, x: 0
, y: 0
, submit: function() {
    this.submitCB && this.submitCB(this.enteredText)
    this.alwaysCB && this.alwaysCB(this.enteredText)
  }
, cancel: function() {
    this.cancelCB && this.cancelCB(this.enteredText)
    this.alwaysCB && this.alwaysCB(this.enteredText)
  }
, update: function(core) {
    if(core.input.getKey(keys.CTRL) && core.input.getKeyDown(keys.C)) { return this.cancel() }
    if(core.input.getKeyDown(keys.ESCAPE)) { return this.cancel() }
    if(core.input.getKeyDown(keys.ENTER)) { return this.submit() }
    if(core.input.getKeyDown(keys.BACKSPACE)) {
      this.enteredText = this.enteredText.slice(0,-1)
      this.updatePromptText()
    }
    var downHistory = core.input.keyCodesDown
    var keysPressedThisFrame = _.sortBy(
      _.filter(_.keys(downHistory), pressedThisFrame.bind(null, core))
    , function(keyCode){ return downHistory[keyCode] }
    )
    var newChars = this.__getTextFromKeyCodesIfPresent(
      keysPressedThisFrame
    , core.input.getKey(keys.SHIFT)
    )
    if(newChars.length > 0) {
      this.enteredText += newChars
      this.updatePromptText()
    }
  }
, __getTextFromKeyCodesIfPresent: function(keyCodesInOrderOfPressing, capitalize) {
    var collectedChars = ''
    _.forEach(keyCodesInOrderOfPressing, function(keyCode) {
      collectedChars += codeToChar(capitalize, keyCode)
    })
    return collectedChars
  }
, updatePromptText: function() {
    follow.call(this.rstring, this)
    this.rstring.string = [this.promptText, this.enteredText].join('\n')
  }
, draw: function(ctx) {
    ctx.fillStyle = '#000'
    ctx.fillRect(this.x-1, this.y-1, this.width+2, this.height+2)
    ctx.fillStyle = this.backgroundColor
    ctx.fillRect(this.x, this.y, this.width, this.height)
    this.rstring.draw(ctx)
  }
}

function pressedThisFrame(core, keyCode) {
  var downHistory = core.input.keyCodesDown
  return downHistory[keyCode] > core.lastUpdate
    && downHistory[keyCode] <= core.lastUpdate + core.physicsTimeStep
}
