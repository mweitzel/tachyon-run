module.exports = After

function After(time, cb) {
  this.afterTime = time
  this.cb = cb
}

After.prototype = {
  update: function(core) {
    if(core.lastUpdate >= this.afterTime) {
      this.cb(core)
      core.removeEntity(this)
    }
  }
}
