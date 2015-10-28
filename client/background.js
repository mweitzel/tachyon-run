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
  }
}

BackgroundObj.drawColor = drawColor
function drawColor(ctx) {
  var storedFillStyle = ctx.fillStyle

  ctx.fillStyle = this.backgroundString
  ctx.fillRect(ctx.origin[0], ctx.origin[1], ctx.width, ctx.height)

  ctx.fillStyle = storedFillStyle
}

BackgroundObj.drawTiledImage = drawTiledImage
function drawTiledImage(ctx) {

}
