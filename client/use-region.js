var StaticCollider = require('./static-collider')
  , beget = require('../beget')
  , follow = require('./follow')

module.exports = UseRegion

function UseRegion(target, bounds, onUse) {
  this.bounds = bounds
  this.onUse = onUse
  follow.call(this, target)
}

UseRegion.prototype = beget(StaticCollider.prototype)
UseRegion.prototype.use = function(user, core) {
  this.onUse(user, core)
}
