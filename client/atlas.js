var format = require('../format-base64-for-html.js')
  , media = require('./media-loader')
  , data = format.apply(format, media.images.atlas)
  , atlasIndex = require('./sprite-atlas-index.js')

module.exports = {
  image: (function() {
    var img = new Image()
    img.src = data
    return img
  })()
, index: atlasIndex
, get frames() {
    return this.index.frames
  }
, getFrameData: function(frameName) {
    return this.index.frames[frameName]
  }
}
