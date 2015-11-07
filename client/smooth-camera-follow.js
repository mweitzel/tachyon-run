var delegate = require('../delegate-with-transform')

module.exports = function follow(target, offsetX, offsetY) {
  delegate(this, target, 'x', function(x) {
    if(typeof this.__xInterpolate === 'undefined')
      this.__xInterpolate = target.x

    this.__xInterpolate = ((this.__xInterpolate * 10) + target.x)/11

    return Math.round(
      (offsetX || 0) + this.__xInterpolate
    )
  }.bind(this))
  delegate(this, target, 'y', function(y) {
    if(typeof this.__yInterpolate === 'undefined')
      this.__yInterpolate = target.y

    this.__yInterpolate = ((this.__yInterpolate * 10) + target.y)/11

    return Math.round(
      (offsetY || 0) + this.__yInterpolate
    )
  }.bind(this))
}
