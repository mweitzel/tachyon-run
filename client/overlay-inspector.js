var z = require('./layer-z-defaults').gui
  , _ = require('lodash')
  , Rstring = require('./renderable-string')
  , follow = require('./follow')

module.exports = OverlayInspector

function OverlayInspector(cursor, layerSelector) {
  this.cursor = cursor
  this.layerSelector = layerSelector
  this.renderString = new Rstring('')
}

OverlayInspector.prototype = {
  z: z
, update: function(core) {
    this.selected = _.find(
      core.entities
    , { x: this.cursor.x, y: this.cursor.y, layer: this.layerSelector.layer }
    )
    this.renderString.string = this.selected
    ? this.generateString(this.selected)
    : this.xyString()
    follow.call(this.renderString, this, -this.renderString.width, 0)
  }
, generateString: function(selected) {
    return [
      this.xyString()
    , 'name: '+selected.name
    , selected.script ? ('script: '+selected.script) : ''
    ].join('\n')
  }
, xyString: function() {
    return [this.cursor.x, this.cursor.y].join(',')
  }
, draw: function(ctx) {
    this.renderString.draw(ctx)
  }
}
