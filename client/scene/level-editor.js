var keys = require('../keys')
  , Sprite = require('../sprite-preconfigured')
  , getSpriteNames = require('../sprite-name-prefixes')
  , atlasIndex = require('../sprite-atlas-index.js')
  , Cursor = require('../level-editor-cursor')
  , Preview = require('../level-editor-piece-previewer')
  , delegate = require('../../delegate-with-transform')
  , follow = require('../follow')
  , Placer = require('../level-editor-piece-placer')
  , Saver = require('../level-editor-serialize')
  , LayerSelector = require('../layer-selector')
  , Prompt = require('../priority-prompt')
  , BackgroundObj = require('../background')
  , handleCommand = require('../level-editor-handle-command')
  , MetaWatcher = require('../meta-data-watcher')
  , Inspector = require('../overlay-inspector')
  , loadPlayableFromEditorEntities = require('../load-playable-level-from-editor-entities')
  , allSprites = require('../all-sprites')

module.exports = function(core) {
  function add(obj) { core.entities.push(obj) }

  var cursor = new Cursor()
  this.cursor = cursor
  follow.call(core.cameraCenter, cursor)
  add(cursor)

  var layers = [
    'ground'
  , 'background'
  , 'foreground'
  , 'script'
  ]
  var layerSelector = new LayerSelector(layers)
  add(layerSelector)
  var saver = new Saver(allSprites)
  try{ saver.load(core.entities, getLevelDataFromLocalStorage()) }
  catch(e) { saver.clear(core.entities) }

  var preview = new Preview(allSprites)
  var placer = new Placer(allSprites)
  var cameraSize = core.cameraSize
  follow.call(layerSelector, core.cameraCenter, -cameraSize.x/2, -cameraSize.y/2)
  follow.call(preview, layerSelector, 0, layerSelector.height)
  add(preview)

  add(new KeyController(preview, cursor, placer, saver, layerSelector))

  add({ layer: 'meta', __isLevelPiece: true, name: 'defualt-editor' , background: '#393' })
  var background = new BackgroundObj('#000')
  add(new MetaWatcher(background))
  add( background)

  var inspector = new Inspector(cursor, layerSelector)
  follow.call(inspector, core.cameraCenter, cameraSize.x/2, -cameraSize.y/2)
  add(inspector)
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
    if(core.input.getKey(keys.SHIFT) && down(keys.P)) {
      this.saver.save(core.entities, setToLocalStorageAndLog)
      var editorEntities = this.saver.parse(getLevelDataFromLocalStorage())
      return loadPlayableFromEditorEntities(core, editorEntities, this.cursor)
    }
    var clrFilter = function() { if(this.layerSelector.layer == 'script'){this.preview.filter = ''} }.bind(this)
    if(down(keys.F)) { clrFilter(); while(this.layerSelector.layer != 'foreground') { this.layerSelector.nextLayer() } }
    if(down(keys.G)) { clrFilter(); while(this.layerSelector.layer != 'ground') { this.layerSelector.nextLayer() } }
    if(down(keys.B)) { clrFilter(); while(this.layerSelector.layer != 'background') { this.layerSelector.nextLayer() } }
    if(down(keys.S)) {
      this.preview.filter = 'token'
      while(this.layerSelector.layer != 'script') { this.layerSelector.nextLayer() }
    }
    if(down(keys['['])) { this.preview.previous() }
    if(down(keys[']'])) { this.preview.next() }
    if(core.input.getKey(keys.V)) {
      if(this.layerSelector.layer == 'script') {
        var piece = placePiece.call(this)
        new Prompt(core, 'enter script for block'
        , function(scriptText) { piece.script = scriptText }
        , core.removeEntity.bind(core, piece)
        )
      }
      else {
        placePiece.call(this)
      }
      function placePiece() {
        return this.placer.addPiece(
          core.entities
        , this.cursor
        , this.preview.active.name
        , this.layerSelector.layer
        )
      }
    }
    if(core.input.getKeyDown(keys.Y)) {
      this.placer.yankAtCoords(
        core.entities
      , this.cursor.x
      , this.cursor.y
      , this.layerSelector.layer
      )
    }
    if(core.input.getKeyDown(keys.P)) {
      this.placer.pasteAtCoords(
        core.entities
      , this.cursor.x
      , this.cursor.y
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
      this.saver.save(core.entities, setToLocalStorageAndLog)
    }
    if(down(keys.E)) {
      this.saver.load(core.entities, getLevelDataFromLocalStorage())
    }
    if(down(keys.Q)) {
      this.saver.clear(core.entities)
    }
  }
}

function setToLocalStorageAndLog(data) {
  localStorage.levelQuickSave = data
  console.log(data)
}

function getLevelDataFromLocalStorage() {
  return localStorage.levelQuickSave
}
