var format = require('../format-base64-for-html.js')
  , media = require('./media-loader')
  , data = format.apply(format, media.images.fontAtlas)
  , Unconfigured = require('./sprite')
  , meta = {}
  , characterAtlasIndex = require('../media/font/font-atlas')
  , Character = Unconfigured.bind(null, fontAtlas(), meta)

module.exports = Character

Character.draw = Unconfigured.draw

if(typeof Image === "undefined") { stubImageIfGlobalUnavailable() }

function fontAtlas() {
  return {
    image: (function() {
      var img = new Image()
      img.src = data
      return img
    })()
  , index: characterAtlasIndex
  , get frames() {
      return this.index.frames
    }
  , getFrameData: function(frameName) {
      return this.index.frames[frameName]
    }
  }
}

function stubImageIfGlobalUnavailable() {
  Image = function() { }
  Image.prototype = { isTestHelper: true }
}
