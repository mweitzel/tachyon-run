var _ = require('lodash')
  , zIndex = require('./layer-z-defaults')
  , delegate = require('../delegate-with-transform')
  , StaticCollider = require('./static-collider')

var usable = addUsableComponentsToLevelEditorPiece.usable = {
  bench: require('./usable/bench')
}

// assumes 'this' will be the level editor script object
module.exports = addUsableComponentsToLevelEditorPiece

function addUsableComponentsToLevelEditorPiece() {
  var usableIdentifier = arguments[0]
  this.use = usable[usableIdentifier]
  delegate(this, this.sprite, 'width')
  delegate(this, this.sprite, 'height')
  _.merge(this, StaticCollider.prototype)
  this.z = zIndex.ground
  return this
}
