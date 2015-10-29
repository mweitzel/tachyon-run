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
  , Saver = require('./level-editor-serialize')
  , LayerSelector = require('./layer-selector')
  , Prompt = require('./priority-prompt')
  , BackgroundObj = require('./background')
  , handleCommand = require('./level-editor-handle-command')
  , MetaWatcher = require('./meta-data-watcher')

module.exports = function(core) {
  function add(obj) { core.entities.push(obj) }

  var cursor = new Cursor()
  follow.call(core.cameraCenter, cursor)
  add(cursor)

  var layers = [
    'ground'
  , 'background'
  , 'foreground'
  ]
  var layerSelector = new LayerSelector(layers)
  add(layerSelector)
  var spriteArray = makeSprites(spriteNames)
  var saver = new Saver(spriteArray)
  var preview = new Preview(spriteArray)
  var placer = new Placer(spriteArray)
  var cameraSize = core.cameraSize
  follow.call(layerSelector, core.cameraCenter, -cameraSize.x/2, -cameraSize.y/2)
  follow.call(preview, layerSelector, 0, layerSelector.height)
  add(preview)

  add(new KeyController(preview, cursor, placer, saver, layerSelector))

  add({ layer: 'meta', __isLevelPiece: true, name: 'defualt-editor' , background: '#393' })
  var background = new BackgroundObj('#000')
  add(new MetaWatcher(background))
  add( background)
}


function KeyController(preview, cursor, placer, saver, layerSelector, handler) {
  this.preview = preview
  this.cursor = cursor
  this.placer = placer
  this.saver = saver
  this.layerSelector = layerSelector
  this.handler = handleCommand.bind(null, saver)
}



KeyController.prototype = {
  update: function(core) {
    var down = core.input.getKeyDown.bind(core.input)
    if(down(keys['/'])) {
      core.input.getKey(keys.SHIFT)
      ? new Prompt(core, 'filter tiles:', function(response) { this.preview.filter = response }.bind(this))
      : new Prompt(core, 'command:', this.handler.bind(null, core))
    }
    if(down(keys.F)) { while(this.layerSelector.layer != 'foreground') { this.layerSelector.nextLayer() } }
    if(down(keys.G)) { while(this.layerSelector.layer != 'ground') { this.layerSelector.nextLayer() } }
    if(down(keys.B)) { while(this.layerSelector.layer != 'background') { this.layerSelector.nextLayer() } }
    if(down(keys['['])) { this.preview.previous() }
    if(down(keys[']'])) { this.preview.next() }
    if(core.input.getKey(keys.V)) {
      this.placer.addPiece(
        core.entities
      , this.cursor
      , this.preview.active.name
      , this.layerSelector.layer
      )
    }
    if(core.input.getKey(keys.D)) {
      this.placer.removeFromCoords(
        core.entities
      , this.cursor.x
      , this.cursor.y
      , this.layerSelector.layer
      )
    }
    if(down(keys.W)) {
      this.saver.save(core.entities, function(data){
        localStorage.levelQuickSave = data
        console.log(data)
      })
    }
    if(down(keys.E)) {
      this.saver.load(core.entities, localStorage.levelQuickSave)
    }
    if(down(keys.Q)) {
      this.saver.clear(core.entities)
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
