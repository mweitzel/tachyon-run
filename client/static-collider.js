var colors = require('./colors')

module.exports = Collider

function Collider() { }

Collider.prototype = {
  bounds: function() {
    return [this.x, this.y, this.width, this.height]
  }
, drawDebug: function(ctx) {
    ctx.lineWidth = 0.5//this.lineWidth || 1
    ctx.strokeStyle=colors.debugCollider
    ctx.beginPath()
    ctx.rect.apply(ctx, this.squidgedBoundsForDebugDraw(this.bounds()))
    ctx.stroke()
  }
, squidgedBoundsForDebugDraw: function(bounds) {
    return [bounds[0] + 0.5, bounds[1] + 0.5, bounds[2] - 1, bounds[3] - 1]
  }
}
