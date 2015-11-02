var _ = require('lodash')
  , startsWith = function(s) { return String.prototype.startsWith.bind(s) }

module.exports = Sprite

function Sprite(atlas, meta, name, startTime) {
  this.startTime = firstDefined([startTime, now()])
  this.atlas = atlas
  meta[name] && _.extend(this, meta[name])
  this.name = name
  this.frameNames = Object
    .keys(atlas.frames)
    .filter(function(a) { return a.startsWith(name) })
    .sort(byLastChunkAsInt)

  initializeWidthHeight.call(this)
}

function initializeWidthHeight() {
  var startFrameName = this.getFrameName(this.startTime)
  var startFrame = this.atlas.frames[startFrameName]
  this.width = this.height = 0
  if(startFrameName) {
    this.width = startFrame.frame.w
    this.height = startFrame.frame.h
  }
}

function byLastChunkAsInt(str1, str2) {
  return lastChunkAsInt(str1) > lastChunkAsInt(str2)
}

function lastChunkAsInt(string) {
  return parseInt(string.split('_').pop())
}

Sprite.prototype = {
  fps: 10
, mirror: false
, get mspf() {
    return 1/(this.fps/1000)
  }
, loop: true
, get totalFrames() {
    return this.frameNames.length
  }
, get maxFrameIndex() {
    return this.totalFrames - 1
  }
, getFrameName: function(time) {
    return this.frameNames[this.frameIndex(time)]
  }
, getFrame: function(time) {
    var name = this.getFrameName(time)
    var data = this.atlas.frames[name].frame
    return { name: name, data: [data.x, data.y, data.w, data.h] }
  }
, frameIndex: function(time) {
    return this.loop
      ? this.framesElapsed(time) % this.totalFrames
      : Math.min(this.framesElapsed(time), this.maxFrameIndex)
  }
, framesElapsed: function(time) {
    return Math.floor(this.timeElapsed(time) / this.mspf)
  }
, timeElapsed: function(optionalTime) {
    return firstDefined([optionalTime, now()]) - this.startTime
  }
}

function firstDefined(arr) {
  for(var i = 0; i < arr.length; i++)
    if(arr[i] !== undefined)
      return arr[i]
}

Sprite.draw = function(ctx) {
  var topLeft = spriteTopLeft(this)
  var src_xywh = this.sprite.getFrame().data
  if(this.sprite.mirror) {
    var atlasW = this.sprite.atlas.image.width
    ctx.drawImage(
      this.sprite.atlas.image.mirror
    , atlasW - (src_xywh[0] + src_xywh[2])
    , src_xywh[1]
    , src_xywh[2]
    , src_xywh[3]
    , topLeft[0]
    , topLeft[1]
    , src_xywh[2]
    , src_xywh[3]
    )
  }
  else {
    ctx.drawImage(
      this.sprite.atlas.image
    , src_xywh[0]
    , src_xywh[1]
    , src_xywh[2]
    , src_xywh[3]
    , topLeft[0]
    , topLeft[1]
    , src_xywh[2]
    , src_xywh[3]
    )
  }
}

function spriteTopLeft(obj) {
  var x
  var y
  if(typeof obj.spriteX !== 'undefined') {
    x = obj.spriteX
  }
  else{
    x = obj.x
  }
  if(typeof obj.spriteY !== 'undefined') {
    y = obj.spriteY
  }
  else{
    y = obj.y
  }
  return [Math.round(x),Math.round(y)]
}

function now() {
  return Date.now()
}
