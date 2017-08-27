var debugDraw = require('./draw-region')

module.exports = regionFromScript

function regionFromScript(regionName, width, height) {
  return new Region(regionName, this.x, this.y, parseInt(width), parseInt(height))
}

function Region(name, x, y, w, h) {
  this.name = name
  this.x = x
  this.y = y
  this.width = w
  this.height = h
}

Region.prototype = {
  collidable: true
, bounds: function () { return [ this.x, this.y, this.width, this.height ] }
, drawDebug: debugDraw
, trigger: function(core, obj) { }
}
