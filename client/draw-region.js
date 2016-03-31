module.exports = function(context) {
  var b = squidgedBoundsForDebugDraw(this.bounds())
  context.fillStyle = 'rgba(0,255,125,0.15)'
  context.fillRect.apply(context, b)

  context.strokeStyle = 'rgba(0,255,125,0.5)'
  context.beginPath()
  context.moveTo(b[0],      b[1])
  context.lineTo(b[0],      b[1]+b[3])
  context.lineTo(b[0]+b[2], b[1]+b[3])
  context.lineTo(b[0]+b[2], b[1])
  context.lineTo(b[0],      b[1])
  context.stroke()
}

function squidgedBoundsForDebugDraw(bounds) {
  return [bounds[0] + 0.5, bounds[1] + 0.5, bounds[2] - 1, bounds[3] - 1]
}
