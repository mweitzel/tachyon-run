var charData = require('../media/font/font-atlas')
  , chars = Object.keys(charData.frames)
  , CharSprite = require('./renderable-character')
  , charSprites = chars.map(function(char) { return new CharSprite(char) })
  , delegate = require('../delegate-with-transform')
  , badCharacterSpriteIndex = chars.indexOf("\nbad")

c = charData
module.exports = CanvasString

function CanvasString(string) {
  this.string = string
  this.chars = string.split("").map(function(char, i) {
    var index = chars.indexOf(char)
    index = index >= 0 ? index : badCharacterSpriteIndex
    var charObj = {
      sprite: charSprites[index]
    , char: char
    , i: i
    , draw: CharSprite.draw
    , xOffset: (8 * i)
    }
    delegate(charObj, this, 'x', function(x) { return charObj.xOffset + x })
    delegate(charObj, this, 'y')
    return charObj
  }.bind(this))
}

CanvasString.prototype = {
  x: 0
, y: 0
, draw: function(ctx) {
    this.chars.forEach(function(char) { char.draw(ctx) })
  }
}
