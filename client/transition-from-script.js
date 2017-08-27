var zIndex = require('./layer-z-defaults').transition
  , colors = require('./colors')
  , beget = require('../beget')

module.exports = makeTransitionFromScript

function makeTransitionFromScript() {
  return new FadeIn(500)
}

function FadeIn(duration) {
  this.duration = duration
}

FadeIn.prototype = {
  z: zIndex
, transitionIn: true
, __exitPrepped: false
, initTime: 0
, currentTime: 0
, update: function(core){
    this.initTime = this.initTime || core.lastUpdate
    this.currentTime = core.lastUpdate
    this.__exitPrepped || this.prepExit(core)
    this.complete() && this.onComplete(core)
  }
, draw: function(ctx) {
    ctx.fillStyle = 'rgba('+this.getColorValues().join(',')+')'
    ctx.fillRect(ctx.origin[0], ctx.origin[1], ctx.width, ctx.height)
  }
, getColorValues: function() {
    return [0,0,0, 1-this.transitionCompleteness()]
  }
, transitionCompleteness: function() {
    return clip((this.currentTime - this.initTime)/this.duration, 0, 1)
  }
, complete: function() {
    return this.transitionCompleteness() === 1
  }
, onComplete: function(core) {
    core.entities.push(new FadeOut())
    core.removeEntity(this)
  }
, prepExit: function(core) {
    core.entities.push(new FadeOut(this.duration))
  }
}

function clip(val, low, high) {
  if( val < low ) { return low }
  if( val > high ) { return high }
  return val
}

//function SleeperTransitionHolder(transition) {
//  this.transition = transition
//}
//SleeperTransitionHolder.prototype = {
//  begin: function(core, callback) {
//    this.transition
//  }
//}

function FadeOut(duration) {
  this.duration = duration
}

FadeOut.prototype = beget(FadeIn.prototype)
FadeOut.prototype.transitionIn = false
FadeOut.prototype.transitionOut = true
FadeOut.prototype.draw = false
FadeOut.prototype.__priorityDraw = FadeIn.prototype.draw
FadeOut.prototype.update = false
FadeOut.prototype.__priorityUpdate = FadeIn.prototype.update
FadeOut.prototype.begin = function(core, done) {
  this.done = done
  this.draw = this.__priorityDraw
  this.update = this.__priorityUpdate
  core.removeEntity(this)
  core.priorityStack.push(this)
}
FadeOut.prototype.getColorValues = function() {
  var colorVals = FadeIn.prototype.getColorValues.call(this)
  colorVals[3] = 1-colorVals[3]
  return colorVals
}
FadeOut.prototype.onComplete = function(core) {
  this.done()
  setTimeout(function() {core.priorityStack.pop()}, 0)
}
