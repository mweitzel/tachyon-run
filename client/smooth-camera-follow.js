var delegate = require('../delegate-with-transform')
  , tileSize = require('./config').tileSize

module.exports = function follow(target, offsetX, offsetY, bounds, cameraSize) {
  var restrict = !!bounds
  if(restrict) {
    var left   = bounds[0]             + (cameraSize.x/2) - (1.5*tileSize)
      , right  = bounds[0] + bounds[2] - (cameraSize.x/2) + (1.5*tileSize)
      , top    = bounds[1]             + (cameraSize.y/2) - (1.5*tileSize)
      , bottom = bounds[1] + bounds[3] - (cameraSize.y/2) + (1.5*tileSize)
  }

  this.__targetForSmoothFollow = target

  delegate(this, target, 'x', function(x) {
    if(typeof this.__xInterpolate === 'undefined')
      this.__xInterpolate = target.x

    this.__xInterpolate = ((this.__xInterpolate * 20) + target.x)/21
    this.__xInterpolate = Math.min(this.__xInterpolate, target.x + 20)
    this.__xInterpolate = Math.max(this.__xInterpolate, target.x - 20)

    var tx = (offsetX || 0) + this.__xInterpolate
    if(restrict) {
      tx = Math.min(tx, right)
      tx = Math.max(tx, left)
    }
    return Math.round(tx)
  }.bind(this))
  delegate(this, target, 'y', function(y) {
    if(typeof this.__yInterpolate === 'undefined')
      this.__yInterpolate = target.y

    this.__yInterpolate = ((this.__yInterpolate * 10) + target.y)/11

    var ty = (offsetY || 0) + this.__yInterpolate
    if(restrict) {
      ty = Math.min(ty, bottom)
      ty = Math.max(ty, top)
    }
    return Math.round(ty)
  }.bind(this))
}
