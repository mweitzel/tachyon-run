var keys = require('./keys')
  , atlas = require('./atlas')
  , spriteMeta = require('./sprite-meta-data')
  , Sprite = require('./sprite').bind(null, atlas, spriteMeta)
  , drawSprite = require('./sprite').draw

module.exports = function(core) {
  core.entities.push(new MenuObject(core))
  core.entities.push(new Dude())
}

function MenuObject(core) { this.core = core }

MenuObject.prototype = {
  update: function() {
    if(this.core.input.getKeyDown(keys.ENTER))
      this.core.sceneLoader.load('level-editor')
  }
}

function Dude() {
    this.sprite = new Sprite('charles')
}

Dude.prototype = {
  x: 100
, y: 100
, update: function() {
    if(Math.random() < 0.99) { return }
    Math.random() > 0.5
      ? this.x++
      : this.x--
    Math.random() > 0.5
      ? this.y++
      : this.y--
  }
, draw: drawSprite
}
