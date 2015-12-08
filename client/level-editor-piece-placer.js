var _ = require('lodash')
  , drawSprite = require('./sprite').draw
  , zLayers = require('./layer-z-defaults')
  , beget = require('../beget')

module.exports = PiecePlacer

function PiecePlacer(sprites) {
  this.__sprites = sprites
  this.__hold = null
}

PiecePlacer.prototype = {
  addPiece: function(coreEntities, cursor, name, layer) {
    this.removeFromCoords(coreEntities, cursor.x, cursor.y, layer)
    var piece = this.__createGameObject(layer, name, cursor.x, cursor.y)
    coreEntities.push(piece)
    return piece
  }
, pasteAtCoords: function(coreEntities, x, y, layer) {
    if(!this.__hold) { return }
    if(this.__hold.layer !== layer) { return }
    this.removeFromCoords(coreEntities, x, y, layer)
    var piece = beget(this.__hold)
    piece.x = x
    piece.y = y
    coreEntities.push(piece)
    return piece
  }
, yankAtCoords: function(coreEntities, x, y, layer) {
    return this.__hold = _.find(coreEntities, isPieceAtCoords.bind(null, layer, x, y))
  }
, removeFromCoords: function(coreEntities, x, y, layer) {
    _.remove(coreEntities, isPieceAtCoords.bind(null, layer, x, y))
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

function isPieceAtCoords(layer, x, y, gameObject) {
  return (
    gameObject.__isLevelPiece &&
    gameObject.layer === layer &&
    gameObject.x === x &&
    gameObject.y === y
  )
}

function LevelEditorGameObject(attrs) {
  _.merge(this, attrs)
  this.z = zLayers[this.layer]
  this.__isLevelPiece = true
}

LevelEditorGameObject.prototype = {
  draw: drawSprite
}
