var sprites = require('./all-sprites')
  , colors = require('./colors')
  , Rstring = require('./renderable-string')
  , follow = require('./follow')

module.exports = HUDText

function HUDText(text) {
  this.rstring = new Rstring(text)
  follow.call(this.rstring, this)
}

HUDText.prototype = {
  drawHUD: function(ctx) {
    this.rstring.draw(ctx)
  }
}
