var follow = require('./follow')
  , _ = require('lodash')

module.exports = BackgroundObj

function BackgroundObj(backgroundString) {
  this.backgroundString = backgroundString
}

BackgroundObj.prototype = {
  paralaxTranslateScale: 0.5
, set backgroundString(backgroundString) {
    this.__backgroundString = backgroundString
    this.draw = backgroundString[0] === '#' ?
      drawColor
    : drawTiledImage
  }
, get backgroundString() {
    return this.__backgroundString
  }
, z: -1000
, update: function(core) {
//    if(typeof this.x != 'number') { follow.call(this, core.cameraCenter)}
  }
}

BackgroundObj.drawColor = drawColor
function drawColor(ctx) {
  var storedFillStyle = ctx.fillStyle

  ctx.fillStyle = this.backgroundString
  ctx.fillRect(2 * ctx.origin[0], 2 * ctx.origin[1], ctx.width * 2, ctx.height * 4)

  ctx.fillStyle = storedFillStyle
}

BackgroundObj.drawTiledImage = drawTiledImage
function drawTiledImage(ctx) {

}
