var _ = require('lodash')

module.exports = floatWithin

var waysToFloat = {
  top: function(obj, bounds) {
    return { y: bounds[1] }
  }
, bottom: function(obj, bounds) {
    return { y: bounds[1] + bounds[3] - obj.height }
  }
, left: function(obj, bounds) {
    return { x: bounds[0] }
  }
, right: function(obj, bounds) {
    return { x: bounds[0] + bounds[2] - obj.width }
  }
, 'h-middle': hMid
, 'h-center': hMid
, 'v-middle': vMid
, 'v-center': vMid
, middle: function(obj, bounds) {
    return _.merge(hMid(obj, bounds), vMid(obj, bounds))
  }
}

function hMid(obj, bounds) {
  var boundsMidX = bounds[0] + (bounds[2]/2)
  return { x: boundsMidX - (obj.width/2) }
}

function vMid(obj, bounds) {
  var boundsMidY = bounds[1] + (bounds[3]/2)
  return { y: boundsMidY - (obj.height/2) }
}

function floatWithin(bounds, directions, object) {
  return _.reduce(directions, function(carry, direction) {
    return _.merge(carry, waysToFloat[direction](object, bounds))
  }, {})
}

floatWithin.waysToFloat = waysToFloat
