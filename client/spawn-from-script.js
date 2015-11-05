var applyNewFunc = require('../new-f-apply')

var spawnable = spawn.spawnable = {
  dummy: require('./spawnable/dummy')
}

module.exports = spawn

// assumes 'this' will be the level editor script object
// to obtain x, y
function spawn() {
  var spawnableIdentifier = arguments[0]
  var spawnableArgs = [this.x, this.y].concat(Array.prototype.slice.call(arguments, 1))
  var S = spawnable[spawnableIdentifier]
  if(!S) { return }
  return applyNewFunc(S, spawnableArgs) // Array.prototype.slice.call(arguments, 1))
}
