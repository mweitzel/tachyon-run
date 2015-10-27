var _ = require('lodash')
  , drawSprite = require('./sprite').draw
  , zLayers = require('./layer-z-defaults')

module.exports = PiecePlacer

function PiecePlacer(sprites) {
  this.__sprites = sprites
}

PiecePlacer.prototype = {
  addPiece: function(coreEntities, cursor, name, layer) {
    this.removeFromCoords(coreEntities, cursor.x, cursor.y, layer)
    coreEntities.push(this.__createGameObject(layer, name, cursor.x, cursor.y))
  }
, removeFromCoords: function(coreEntities, x, y, layer) {
    _.remove(coreEntities, function(gameObject) {
      return (
        gameObject.__isLevelPiece &&
        gameObject.layer === layer &&
        gameObject.x === x &&
        gameObject.y === y
      )
    })
  }
, __createGameObject: function(layer, name, x, y) {
    var sprite = _.find(this.__sprites, { name: name })
    return new LevelEditorGameObject({
      layer: layer
    , sprite: sprite
    , x: x, y: y
    , name: name
    })
  }
}

function LevelEditorGameObject(attrs) {
  _.merge(this, attrs)
  this.z = zLayers[this.layer]
  this.__isLevelPiece = true
}

LevelEditorGameObject.prototype = {
  draw: drawSprite
}
