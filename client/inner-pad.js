module.exports = function(bounds, padding) {
  var midX = bounds[0] + (bounds[2]/2)
  var midY = bounds[1] + (bounds[3]/2)
  return [
    Math.min(midX, bounds[0] + padding )
  , Math.min(midY, bounds[1] + padding )
  , Math.max(midX, bounds[2] - 2 * padding )
  , Math.max(midY, bounds[3] - 2 * padding )
  ]
}