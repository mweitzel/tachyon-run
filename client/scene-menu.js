var keys = require('./keys')
  , atlas = require('./atlas')
  , Sprite = require('./sprite-preconfigured')

module.exports = function(core) {
  core.entities.push(new MenuObject())
  core.entities.push(new Dude(10, 10))
  core.entities.push(new Dude(50, 50))
  core.entities.push(new Dude(-50, -50))
  core.entities.push(new Dude(-50, 50))
  core.entities.push(new Dude(50, -50))
}

function MenuObject() { }

MenuObject.prototype = {
  update: function(core) {
    if(core.input.getKeyDown(keys.ENTER))
      core.sceneLoader.load('level-editor')
  }
}

function Dude(x, y) {
  this.x = x
  this.y = y
  this.sprite = new Sprite('charles')
}

Dude.prototype = {
  x: 0
, y: 0
, update: function() {
    if(Math.random() < 0.9) { return }
    Math.random() > 0.5
      ? this.x++
      : this.x--
    Math.random() > 0.5
      ? this.y++
      : this.y--
  }
, draw: Sprite.draw
}
