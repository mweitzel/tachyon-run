var _ = require('lodash')
  , BackgroundObj = require('./background')
  , MetaWatcher = require('./meta-data-watcher')
  , StaticCollider = require('./static-collider')
  , delegate = require('../delegate-with-transform')
  , deferToSprite = ['width', 'height']
  , scriptToObjUncurried = require('./level-editor-script-to-game-object')


module.exports = convertParsedLevelDataToPlayable

function convertParsedLevelDataToPlayable(recursiveSerializedToGOFn, levelEditorEntities) {
  makeGroundPiecesStaticCollidable(levelEditorEntities)
  addBackGroundAndMetaDataWatcher(levelEditorEntities)
  replaceScriptsWithObjects(recursiveSerializedToGOFn, levelEditorEntities)
  return levelEditorEntities
}

function replaceScriptsWithObjects(recursiveSerializedToGOFn, entities) {
  var scriptToObj = scriptToObjUncurried.bind(null, recursiveSerializedToGOFn)
  var scripts = _.filter(entities, { __isLevelPiece: true, layer: 'script' })
  _.forEach(
    scripts
  , _.remove.bind(_, entities)
  )
  _.forEach(
    _.compact(scripts.map(function(scriptObj) {
      return scriptToObj(scriptObj)
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
  var grounds = _.filter(entities, { __isLevelPiece: true, layer: 'ground' })
  _.forEach(
    grounds
  , makeStaticCollidable
  )

  _.forEach(
    _.filter(grounds, function(ground) {
      return ground.name && ground.name.indexOf('platform') > -1
    })
  , function(ground) { ground.isOneWayPlatform = true }
  )
  return entities
}

function makeStaticCollidable(ground) {
  for(var i = 0; i < deferToSprite.length; i++) {
    delegate(ground, ground.sprite, deferToSprite[i])
  }
  _.merge(ground, StaticCollider.prototype)
}
