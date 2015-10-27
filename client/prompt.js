var zIndex = require('./layer-z-defaults').prompt
  , _ = require('lodash')
  , keys = require('./keys')

module.exports = Prompt

function Prompt(text, submitCB, cancelCB) {
  this.promptText = text
  this.submitCB = submitCB
  this.cancelCB = cancelCB
}

Prompt.prototype = {
  z: zIndex
, enteredText: ''
, submit: function() {
    this.submitCB(this.enteredText)
  }
, cancel: function() { this.cancelCB() }
, update: function(core) {
    if(core.input.getKeyDown(keys.ESCAPE)) { return this.cancelCB() }
    if(core.input.getKeyDown(keys.ENTER)) { return this.submitCB(this.enteredText) }
  // screen for esc and enter
    var shift = core.input.getKeyDown(keys.SHIFT)
    var downHistory = core.input.keyCodesDown
    var keysPressedThisFrame = _.sortBy(
      _.filter(_.keys(downHistory), pressedThisFrame.bind(null, core))
    , function(keyCode){ return downHistory[keyCode] }
    )
    _.forEach(keysPressedThisFrame, function(keyCode) {
      var char = _.findKey(keys , function(value) { return value == keyCode } )
      this.enteredText += shift ? char.toUpperCase() : char.toLowerCase()
    }.bind(this))
  }
}

function pressedThisFrame(core, keyCode) {
  var downHistory = core.input.keyCodesDown
  return downHistory[keyCode] > core.lastUpdate
    && downHistory[keyCode] <= core.lastUpdate + core.physicsTimeStep
}
