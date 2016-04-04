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
    this.underCursor = _.filter(
      _.filter(
        core.entities
      , { x: this.cursor.x, y: this.cursor.y }
      )
    , function(obj) { return !!obj.layer }
    )
    this.selected = _.find(
      this.underCursor
    , { layer: this.layerSelector.layer }
    )
    this.renderString.string = this.selected
    ? this.generateString(this.selected)
    : this.xyString()
    if(this.layerPreviewString()) {
      this.renderString.string = '('+this.layerPreviewString()+')' + this.renderString.string
    }
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
, layerPreviewString: function() {
    return this.underCursor
      .map(function(editorObject) { return editorObject.layer })
      .map(function(string) { return string[0] })
      .sort()
      .join(',')
  }
, draw: function(ctx) {
    this.renderString.draw(ctx)
  }
}
