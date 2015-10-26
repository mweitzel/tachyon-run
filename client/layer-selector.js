var _ = require('lodash')
  , Rstring = require('./renderable-string')
  , follow = require('./follow')

module.exports = LayerSelector

function LayerSelector(layers) {
  this.layers = layers.map(it)
  this.updateRenderString()
}

LayerSelector.prototype = {
  get layer() { return this.layers[0] }
, get height() {
    return this.renderString.height
  }
, nextLayer: function() {
    bbb = this
    this.layers.push(_(this.layers).shift())
    this.updateRenderString()
  }
, updateRenderString: function() {
   this.renderString = new Rstring(this.layer)
   follow.call(this.renderString, this)
  }
, draw: function(ctx) {
    this.renderString.draw(ctx)
  }
}

function it(x) { return x }
