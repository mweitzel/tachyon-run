var sprites = require('./all-sprites')
module.exports = BackgroundObj

function BackgroundObj(backgroundString) {
  this.backgroundString = backgroundString
}

BackgroundObj.prototype = {
  paralaxTranslateScale: 0.5
, set backgroundString(backgroundString) {
    this.__backgroundString = backgroundString
    this.sprite = sprites.get(this.__backgroundString)
    this.draw = (this.__backgroundString[0] === '#')
    ? drawColor
    : drawTiledImage
  }
, get backgroundString() {
    return this.__backgroundString
  }
, z: -1000
, update: function(core) { }
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
  var topLeft = ctx.origin
  var staticOffset = scaled(ctx.origin, -1)
  var paralaxOffset = scaled(
    staticOffset
  , 0.5
  ).map(mod.bind(this.sprite.height))
  var src_xywh = this.sprite.getFrame().data
  for(var i = topLeft[0] - this.sprite.width + paralaxOffset[0]; i < topLeft[0] + ctx.width; i += this.sprite.width) {
    for(var j = topLeft[1] - this.sprite.height + paralaxOffset[1]; j < topLeft[1] + ctx.height; j += this.sprite.height) {
      ctx.drawImage(
        this.sprite.atlas.image
      , src_xywh[0]
      , src_xywh[1]
      , src_xywh[2]
      , src_xywh[3]
      , i
      , j
      , src_xywh[2]
      , src_xywh[3]
      )
    }
  }
}

function scaled(xy, scaler) {
  return xy.map(function(o) {
    return Math.round(o * scaler)
  })
}

function mod(num) {
  return num % this
}
