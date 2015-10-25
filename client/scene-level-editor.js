var keys = require('./keys')
  , Sprite = require('./sprite-preconfigured')
  , getSpriteNames = require('./sprite-name-prefixes')
  , atlasIndex = require('./sprite-atlas-index.js')
  , spriteNames = getSpriteNames(Object.keys(atlasIndex.frames))
  , Cursor = require('./level-editor-cursor')
  , Preview = require('./level-editor-piece-previewer')
  , delegate = require('../delegate-with-transform')
  , follow = require('./follow')
  , Placer = require('./level-editor-piece-placer')


module.exports = function(core) {
  function add(obj) { core.entities.push(obj) }

  var cursor = new Cursor()
  follow.call(core.cameraCenter, cursor)
  add(cursor)

  // temporary, for visual reference
  var block = new BlockA()
  block.__isLevelPiece = true
  add(block)

  var spriteArray = makeSprites(spriteNames)
  var preview = new Preview(spriteArray)
  var placer = new Placer(spriteArray)
  var cameraSize = core.cameraSize
  follow.call(preview, core.cameraCenter, -cameraSize.x/2, -cameraSize.y/2)
  add(preview)

  add(new KeyController(preview, cursor, placer))
}

function KeyController(preview, cursor, placer) {
  this.preview = preview
  this.cursor = cursor
  this.placer = placer
}

KeyController.prototype = {
  update: function(core) {
    var down = core.input.getKeyDown.bind(core.input)
    if(down(keys['['])) { this.preview.previous() }
    if(down(keys[']'])) { this.preview.next() }
    if(down(keys.V)) {
      this.placer.addPiece(core.entities, this.cursor, this.preview.active.name)
    }
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
