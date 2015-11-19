module.exports = function(core, objToRemove, delay) {
  var remover = new Remover(core, objToRemove, delay)
  core.entities.push(remover)
  return remover
}

function Remover(core, objToRemove, condition) {
  this.condition = condition
  this.objToRemove = objToRemove
}

Remover.prototype = {
  update: function(core) {
    if(this.condition()) {
      core.removeEntity(this.objToRemove)
      core.removeEntity(this)
    }
  }
}
