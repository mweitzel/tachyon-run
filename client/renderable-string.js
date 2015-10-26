var charData = require('../media/font/font-atlas')
  , chars = Object.keys(charData.frames)
  , CharSprite = require('./renderable-character')
  , charSprites = chars.map(function(char) { return new CharSprite(char) })
  , delegate = require('../delegate-with-transform')
  , badCharacterSpriteIndex = chars.indexOf("\nbad")
  , _ = require('lodash')

c = charData
module.exports = CanvasString

function CanvasString(string) {
  this.string = string
}

CanvasString.prototype = {
  x: 0
, y: 0
, get height() {
    return this.__string.split('\n').length * 16
  }
, draw: function(ctx) {
    this.chars.forEach(function(char) { char.draw(ctx) })
  }
, set string(str) {
    this.__string = str
    this.chars = _.flatten(
      str.split('\n').map(function(line, h) {
        return line.split("").map(function(char, i) {
          var index = chars.indexOf(char)
          index = index >= 0 ? index : badCharacterSpriteIndex
          var charObj = {
            sprite: charSprites[index]
          , char: char
          , i: i
          , draw: CharSprite.draw
          , xOffset: (8 * i)
          , yOffset: (16* h)
          }
          delegate(charObj, this, 'x', function(x){ return charObj.xOffset + x })
          delegate(charObj, this, 'y', function(y){ return charObj.yOffset + y })
          return charObj
        }.bind(this))
      }.bind(this))
    )
  }
}
