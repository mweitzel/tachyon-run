var _ = require('lodash')

module.exports = function(spriteFrameNames) {
  return _.uniq(
    spriteFrameNames
      .map(removeExtension)
      .map(removeNumberSuffix)
  )
}

function removeExtension(str) {
  return str.split('.')[0]
}

function removeNumberSuffix(str) {
  var parts = str.split('_')
  if(parsesToNumber(last(parts))) {
    parts.pop()
  }
  return parts.join('_')
}

function parsesToNumber(str) {
  var parsed = parseInt(str)
  return str < Infinity
}

function last(arr) {
  return arr[arr.length-1]
}
