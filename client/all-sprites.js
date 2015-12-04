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
  var foundSprite = _.find(sprites, {name: name})
  if(!foundSprite && name == 'not_found' ) { return }
  if(!foundSprite) { return this.get('not_found') }
  var s = beget(foundSprite)
  s.startTime = Date.now()
  return s
}
