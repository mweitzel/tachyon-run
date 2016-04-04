module.exports = toViewportCoords

function toViewportCoords(core, coords) {
  return [
    coords[0] - core.context.origin[0]
  , coords[1] - core.context.origin[1]
  ]
}
