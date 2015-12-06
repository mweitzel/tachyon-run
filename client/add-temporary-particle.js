var Particle = require('./particle')
  , timedRemove = require('./remove-obj-after-time')

module.exports = addTemporaryParticle

function addTemporaryParticle(spriteName, core, options) {
  var p = new Particle(spriteName, options)
  core.entities.push(p)
  timedRemove(core, p, p.sprite.loopDuration())
}
