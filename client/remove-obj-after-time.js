module.exports = function(core, objToRemove, delay) {
  var remover = new Remover(core, objToRemove, delay)
  core.entities.push(remover)
  return remover
}

function Remover(core, objToRemove, delay) {
  this.initTime = core.lastUpdate
  this.objToRemove = objToRemove
  this.deleteAfter = this.initTime + delay
}

Remover.prototype = {
  update: function(core) {
    if(core.lastUpdate >= this.deleteAfter) {
      core.removeEntity(this.objToRemove)
      core.removeEntity(this)
    }
  }
}
