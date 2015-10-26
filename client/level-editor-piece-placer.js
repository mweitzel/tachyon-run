var _ = require('lodash')
  , drawSprite = require('./sprite').draw
  , zIndicesForLayers = {
      background: -100
    , ground: 0
    , foreground: 100
    }

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
    return new LevelEditorGameObject(layer, sprite, x, y)
  }
}

function LevelEditorGameObject(layer, sprite, x, y) {
  this.sprite = sprite
  this.layer = layer
  this.name = sprite.name
  this.x = x
  this.y = y
  this.z = zIndicesForLayers[layer]
  this.__isLevelPiece = true
}

LevelEditorGameObject.prototype = {
  draw: drawSprite
}
