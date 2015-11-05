var _ = require('lodash')
  , Sprite = require('./sprite')
  , StaticCollider = require('./static-collider')
  , colors = require('./colors')

module.exports = function(ctx, core) {
  this.z = 2000000000000 // draw last
  StaticCollider.prototype.drawDebug.call(this, ctx)
  _.forEach(
    core.tileMap.getOthersNear(this)
  , function(thing) {
      if(!thing.collidable) { return }
      ctx.lineWidth = 0.5
      ctx.strokeStyle=colors.debugCollider.special
      ctx.beginPath()
      ctx.rect.apply(ctx, thing.squidgedBoundsForDebugDraw(thing.bounds()))
      ctx.stroke()
    }
  )
}
