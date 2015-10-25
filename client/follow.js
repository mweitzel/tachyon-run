var delegate = require('../delegate-with-transform')

module.exports = function follow(target, offsetX, offsetY) {
  delegate(this, target, 'x', function(x) { return x + (offsetX || 0) })
  delegate(this, target, 'y', function(y) { return y + (offsetY || 0) })
}
