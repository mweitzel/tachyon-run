var format = require('../format-base64-for-html')
  , media = require('./media-loader')
  , data = format.apply(format, media.images.atlas)
  , atlasIndex = require('./sprite-atlas-index')

if(typeof Image === "undefined") { stubImageIfGlobalUnavailable() }

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

function stubImageIfGlobalUnavailable() {
  Image = function() { }
  Image.prototype = { isTestHelper: true }
}
