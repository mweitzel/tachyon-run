var keys = require('./keys')
  , Sprite = require('./sprite-preconfigured')
  , getSpriteNames = require('./sprite-name-prefixes')
  , atlasIndex = require('./sprite-atlas-index.js')
  , spriteNames = getSpriteNames(Object.keys(atlasIndex.frames))
  , Cursor = require('./level-editor-cursor')
  , Preview = require('./level-editor-piece-previewer')
  , delegate = require('../delegate-with-transform')


module.exports = function(core) {
  var cursor = new Cursor()
  delegate(core.cameraCenter, cursor, 'x')
  delegate(core.cameraCenter, cursor, 'y')

  // temporary, for visual reference
  core.entities.push(cursor)
  core.entities.push(new BlockA())

  var preview = this.preview = new Preview(makeSprites(spriteNames))
  p = preview
  var cameraSize = core.cameraSize
  preview.follow(core.cameraCenter, -cameraSize.x/2, -cameraSize.y/2)
  core.entities.push(preview)

  core.entities.push(new KeyController(preview))
}

function KeyController(preview) {
  this.preview = preview
}

KeyController.prototype = {
  update: function(core) {
    if(core.input.getKeyDown(keys['['])) { this.preview.previous() }
    if(core.input.getKeyDown(keys[']'])) { this.preview.next() }
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
