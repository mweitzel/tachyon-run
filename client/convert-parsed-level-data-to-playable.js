var _ = require('lodash')
  , BackgroundObj = require('./background')
  , MetaWatcher = require('./meta-data-watcher')
  , StaticCollider = require('./static-collider')
  , delegate = require('../delegate-with-transform')
  , deferToSprite = ['width', 'height']
  , scriptToObj = require('./level-editor-script-to-game-object')


module.exports = convertParsedLevelDataToPlayable

function convertParsedLevelDataToPlayable(recursiveSerializedToGOFn, levelEditorEntities) {
  makeGroundPiecesStaticCollidable(levelEditorEntities)
  addBackGroundAndMetaDataWatcher(levelEditorEntities)
  replaceScriptsWithObjects(recursiveSerializedToGOFn, levelEditorEntities)
  return levelEditorEntities
}

function replaceScriptsWithObjects(recursiveSerializedToGOFn, entities) {
  var scripts = _.filter(entities, { __isLevelPiece: true, layer: 'script' })
  _.forEach(
    scripts
  , _.remove.bind(_, entities)
  )
  _.forEach(
    _.compact(scripts.map(function(scriptObj) {
      return scriptToObj(recursiveSerializedToGOFn, scriptObj)
    }))
  , function(obj) { entities.push(obj) }
  )
}

function addBackGroundAndMetaDataWatcher(entities) {
  var background = new BackgroundObj('#000')
  entities.push(new MetaWatcher(background))
  entities.push(background)
}

function makeGroundPiecesStaticCollidable(entities) {
  _.forEach(
    _.filter(entities, { __isLevelPiece: true, layer: 'ground' })
  , makeStaticCollidable
  )
  return entities
}

function makeStaticCollidable(ground) {
  for(var i = 0; i < deferToSprite.length; i++) {
    delegate(ground, ground.sprite, deferToSprite[i])
  }
  _.merge(ground, StaticCollider.prototype)
}
