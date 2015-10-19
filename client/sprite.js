var _ = require('lodash')
  , startsWith = function(s) { return String.prototype.startsWith.bind(s) }

module.exports = Sprite

function Sprite(atlas, meta, name, startTime) {
  this.startTime = firstDefined([startTime, now()])
  this.atlas = atlas
  this.spriteData = meta
  this.name = name
  this.frameNames = Object
    .keys(atlas.frames)
    .filter(function(a) { return a.startsWith(name) })
    .sort(byLastChunkAsInt)
}

function byLastChunkAsInt(str1, str2) {
  return lastChunkAsInt(str1) > lastChunkAsInt(str2)
}

function lastChunkAsInt(string) {
  return parseInt(string.split('_').pop())
}

Sprite.prototype = {
  fps: 10
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
, getFrame: function(time) {
    return this.frameNames[this.frameIndex(time)]
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

// context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);

function firstDefined(arr) {
  for(var i = 0; i < arr.length; i++)
    if(arr[i] !== undefined)
      return arr[i]
}

function now() {
  return new Date().getTime()
}
