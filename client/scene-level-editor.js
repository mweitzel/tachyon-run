var keys = require('./keys')
  , Sprite = require('./sprite-preconfigured')
  , getSpriteNames = require('./sprite-name-prefixes')
  , atlasIndex = require('./sprite-atlas-index.js')
  , spriteNames = getSpriteNames(Object.keys(atlasIndex.frames))
  , Cursor = require('./level-editor-cursor')
  , Preview = require('./level-editor-piece-previewer')


module.exports = function(core) {
  this.core = core
  core.entities.push(new Cursor(core))

  // temporary, for visual reference
  core.entities.push(new BlockA())

  var preview = this.preview = new Preview(makeSprites(spriteNames), core)
  p = preview
  var cameraSize = core.cameraSize
  preview.follow(core.cameraCenter, -cameraSize.x/2, -cameraSize.y/2)
  core.entities.push(preview)

  core.entities.push(new KeyController(core, preview))
}

function KeyController(core, preview) {
  this.core = core
  this.preview = preview
}

KeyController.prototype = {
  update: function() {
    if(this.core.input.getKeyDown(keys['['])) { this.preview.previous() }
    if(this.core.input.getKeyDown(keys[']'])) { this.preview.next() }
  }
}


function BlockA() { }
BlockA.prototype = {
  x: 0
, y: 0
, sprite: new Sprite('block_a')
, draw: Sprite.draw
}

function makeSprites() {
  return spriteNames.map(function(name) {
    return new Sprite(name)
  })
}
