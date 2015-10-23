var  atlas = require('./atlas')
  , spriteMeta = require('./sprite-meta-data')
  , Unconfigured = require('./sprite')
  , Sprite = Unconfigured.bind(null, atlas, spriteMeta)

module.exports = Sprite

Sprite.draw = Unconfigured.draw
