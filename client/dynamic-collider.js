var Playable = require('./playable-entity')

module.exports = DynamicCollider

function DynamicCollider() {}
DynamicCollider.prototype = Playable.prototype