module.exports = function(boundsArray) {
  return boundsArray
  .reduce(
    function(prev, current) {
      var nextX = Math.min(prev[0], current[0])
        , nextY = Math.min(prev[1], current[1])
      return [
        nextX
      , nextY
      , right(prev) > right(current)
        ? right(prev) - nextX
        : right(current) - nextX
      , bottom(prev) > bottom(current)
        ? bottom(prev) - nextY
        : bottom(current) - nextY
      ]
    }
  , [0,0,0,0])
}

function right(bounds) {
  return bounds[0] + bounds[2]
}

function bottom(bounds) {
  return bounds[1] + bounds[3]
}
