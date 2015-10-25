var _ = require('lodash')
  , drawSprite = require('./sprite').draw

module.exports = PiecePlacer

function PiecePlacer(sprites) {
  this.__sprites = sprites
}

PiecePlacer.prototype = {
  addPiece: function(coreEntities, cursor, name) {
    _.remove(coreEntities, function(gameObject) {
      return (
        gameObject.__isLevelPiece &&
        gameObject.x === cursor.x &&
        gameObject.y === cursor.y
      )
    })
    coreEntities.push(this.__createGameObject(name, cursor.x, cursor.y))
  }
, __createGameObject: function(name, x, y) {
    var sprite = _.find(this.__sprites, { name: name })
    return new LevelEditorGameObject(sprite, x, y)
  }
}

function LevelEditorGameObject(sprite, x, y) {
  this.sprite = sprite
  this.x = x
  this.y = y
}

LevelEditorGameObject.prototype = {
  draw: drawSprite
, __isLevelPiece: true
}
