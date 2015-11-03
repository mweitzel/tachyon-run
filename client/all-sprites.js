var _ = require('lodash')
  , Sprite = require('./sprite-preconfigured')
  , atlasIndex = require('./sprite-atlas-index.js')
  , getSpriteNames = require('./sprite-name-prefixes')
  , spriteNames = getSpriteNames(Object.keys(atlasIndex.frames))
  , beget = require('../beget')
  , sprites = (function () {
      return spriteNames.map(function(name) {
        return new Sprite(name)
      })
    })()

module.exports = sprites

sprites.get = function(name) {
  return beget(_.find(sprites, {name: name}))
}
