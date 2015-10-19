var format = require('../format-base64-for-html.js')
  , media = require('./media-loader')
  , data = format.apply(format, media.images.atlas)
  , atlasIndex = require('./sprite-atlas-index.js')

module.exports = {
  image: new Image(data)
, index: atlasIndex
, getFrameData: function(frameName) {
    return this.index.frames[frameName]
  }
}
