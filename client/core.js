var _ = require('lodash')

module.exports = Core

function Core(window, context) {
  this.window = window
  this.document = this.window.document
  this.lastUpdate = new Date().getTime()
  this.input = new Input(this)
  this.context = context
  this.cameraCenter = { x: 0, y: 0 }
  this.entities = []
  this.priorityStack = []
}

function eqeqeq(obj) { return this === obj }

Core.prototype = {
  physicsTimeStep: 1000/60
, removeEntity: function(obj) {
    _.remove(this.entities, eqeqeq.bind(obj))
    this.tileMap && this.tileMap.removeObj(obj)
  }
, removePriorityObj: function(obj) {
    _.remove(this.priorityStack, eqeqeq.bind(obj))
  }
, get cameraSize() {
    return { x: this.context.width, y: this.context.height }
  }
, draw: function() {
    this.entities = _.sortBy(this.entities, function(e) { return (e.z||0) })
    var translateDrawingsX = Math.floor((this.cameraSize.x/2) - this.cameraCenter.x)
    var translateDrawingsY = Math.floor((this.cameraSize.y/2) - this.cameraCenter.y)
    this.context.setTransform(1, 0, 0, 1, translateDrawingsX, translateDrawingsY)

    this.context.clearRect(
      -translateDrawingsX
    , -translateDrawingsY
    , this.context.width
    , this.context.height
    )
    this.context.origin = [-translateDrawingsX, -translateDrawingsY]

    for (var i=0; i < this.entities.length; i++) {
      this.entities[i].draw && this.entities[i].draw(this.context)
      if(this.debug) {
        this.entities[i].drawDebug && this.entities[i].drawDebug(this.context, this)
      }
    }

    this.context.setTransform(1, 0, 0, 1, 0, 0)// translateDrawingsX, translateDrawingsY)
    this.context.origin = [0, 0]

    if(this.priorityStack.length === 0) {
      for (var i=0; i < this.entities.length; i++) {
        this.entities[i].drawHUD && this.entities[i].drawHUD(this.context, this)
      }
    }

    for (var i=0; i < this.priorityStack.length; i++) {
      this.priorityStack[i].draw && this.priorityStack[i].draw(this.context)
    }
  }
, get nextUpdate() {
    return this.lastUpdate + this.physicsTimeStep
  }
, step: function() {
    if(this.priorityStack.length > 0) {
      _.last(this.priorityStack).update && _.last(this.priorityStack).update(this)
    }
    else {
      typeof this.beforeUpdate === 'function' && this.beforeUpdate(this)
      for (var i=0; i < this.entities.length; i++) {
        this.entities[i].update && this.entities[i].update(this)
      }
    }
    this.lastUpdate += this.physicsTimeStep
  }
, lastUniqueId: function(){
    return 0
  }
, uniqueId: function(){
    var a = this.lastUniqueId()
    this.lastUniqueId = function(){
      return a+1
    }
    return a + 1
  }
, update: function() {
    var currentTime = new Date().getTime()

    // if frames back up 0.5 seconds, eat the lag and move on
    if( currentTime - this.lastUpdate > 500){
      this.lastUpdate = currentTime
    }

    // perform updates for all due frames, up to 0.5 seconds ago
    var stepsTaken = 0
    while(this.lastUpdate < currentTime - this.physicsTimeStep){
      stepsTaken++
      this.step()
    }
    if(stepsTaken === 0) { return }
    // draws are expensive, so don't double draw, it causes jitter

    this.draw()
  }
, updateAndRegisterNextUpdate: function() {
    if(this.paused) { return }
    this.update()
    this.window.requestAnimationFrame(this.updateAndRegisterNextUpdate.bind(this))
  }
, paused: true
, pause: function(){ this.paused = true }
, play: function(){
    this.paused = false
    this.updateAndRegisterNextUpdate()
    this.lastUpdate = new Date().getTime()
  }
, start: function(){ return this.play() }
, stop: function(){ return this.pause() }
, togglePaused: function(){ this.paused = !this.paused }
}

function Input(core) {
  this.core = core
  this.keyCodesDown = _.fill(new Array(256), 0)
  this.keyCodesUp = _.fill(new Array(256), 0)

  function keyDown(event){
    if(event.keyCode == 8   // backspace
    || event.keyCode == 9   // tab
    || event.keyCode == 191 // '/'
    ) {
      event.preventDefault()
      event.stopPropagation()
    }
    // doesn't catch bs refires of the keypres..sssssssss!
    if(this.downAt(event.keyCode) <= this.upAt(event.keyCode))
      this.keyCodesDown[event.keyCode] = event.timeStamp
  }

  function keyUp(event){
    this.keyCodesUp[event.keyCode] = event.timeStamp
  }

  this.keyDown = keyDown.bind(this)
  this.keyUp = keyUp.bind(this)
  core.document.addEventListener('keydown', this.keyDown)
  core.document.addEventListener('keyup', this.keyUp)
}

Input.prototype = {
  downAt: function(keyCode){
    return this.keyCodesDown[keyCode] || 0
  }
, upAt: function(keyCode){
    return this.keyCodesUp[keyCode] || 0
  }
, getKey: function(keyCode){
    // frames are not backed up
    // both keydown and keyup in same frame when backed up
    return ((this.downAt(keyCode) > this.upAt(keyCode)) && this.downAt(keyCode) < this.core.lastUpdate + this.core.physicsTimeStep) || this.getKeyDown(keyCode)
  }
, getKeyDown: function(keyCode){
    return this.core.lastUpdate <= this.downAt(keyCode)
        && this.downAt(keyCode) <  this.core.nextUpdate
  }
, getKeyUp: function(keyCode){
    //frames are not backed up
    return (this.upAt(keyCode) > this.core.lastUpdate && this.upAt(keyCode) < this.core.lastUpdate + this.core.physicsTimeStep)
  }
, downDuration: function(keyCode){
    return Math.max(0, this.core.lastUpdate - this.downAt(keyCode))
  }
}
