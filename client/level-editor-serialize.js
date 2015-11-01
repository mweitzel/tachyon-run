var _ = require('lodash')
  , beget = require('../beget')
  , drawSprite = require('./sprite').draw
  , zLayers = require('./layer-z-defaults')
  , groundPieceSavedAttrs = [
      'x'
    , 'y'
    , 'script'
    ]


module.exports = Saver

function Saver(sprites) {
  this.sprites = sprites
}

Saver.prototype = {
  save: function(entities, callback) {
    callback(this.serialize(entities))
  }
, load: function(entities, serializeData) {
    this.clear(entities)
    _.forEach(
      this.parse(serializeData)
    , function(entity) { entities.push(entity) }
    )
  }
, clear: function(entities) {
    _.remove(entities, function(piece) { return piece.__isLevelPiece })
  }
, __findMetaEntities: function(entities) {
    return _.find(entities, { layer: 'meta' })
  }
, __rejectMetaEntities: function(entities) {
    return _.reject(entities, { layer: 'meta' })
  }
, __filterToLevelPieces: function(entities) {
    return _.filter(entities, { __isLevelPiece: true })
  }
, serialize: function(entities) {
    var saveObject = {}

    var saveable = this.__filterToLevelPieces(entities)
    var meta = this.__findMetaEntities(saveable)
    if(meta)
      saveObject.meta = this.__serializeMetaObj(meta)


    var blocks = this.__rejectMetaEntities(saveable)
    var layers = _.map(_.unique(blocks, 'layer'), 'layer')
    var objNames = _.pluck(blocks, 'name')

    _.each(layers, function(layer) {
      var objNames = _.pluck(_.where(blocks, {layer: layer}), 'name')
      var layerSaveObj = {}
      _.each(objNames, function(name) {
        layerSaveObj[name] = _.chain(blocks)
          .where({ name: name, layer: layer })
          .map(this.__objToAttrArray)
          .value()
      }.bind(this))
      saveObject[layer] = layerSaveObj
    }.bind(this))

    return JSON.stringify(saveObject)
  }
, __serializeMetaObj: function(metaObj) {
    return {
      name: metaObj.name
    , background: metaObj.background
    }
  }
, __instanciateMetaObj: function(serializedMeta) {
    return _.merge({ __isLevelPiece: true, layer: 'meta' }, serializedMeta)
  }
, __objToAttrArray: function(obj) {
    var returnObj = []
    _.each(groundPieceSavedAttrs, function(attr) {
      if(typeof obj[attr] !== 'undefined')
        returnObj.push(obj[attr])
    })
    return returnObj
  }
, __arrayToAttrObj: function(arr) {
    var returnObj = {}
    _.each(arr, function(attr, i) {
      returnObj[groundPieceSavedAttrs[i]] = attr
    })
    return returnObj
  }
, parse: function(json) {
    var entities = []
    var serialized = JSON.parse(json)

    if(serialized.meta)
      entities.push(this.__instanciateMetaObj(serialized.meta))

    var layers = _.without(_.keys(serialized), 'meta')
    _.forEach(layers, function(layer) {
      var objNames = _.keys(serialized[layer])
      _.forEach(objNames, function(name) {
        _.forEach(serialized[layer][name], function(objAttrList) {
          var attrs = this.__arrayToAttrObj(objAttrList)
          attrs.layer = layer
          attrs.z = zLayers[layer]
          entities.push(this.generateObject(name, attrs))
        }.bind(this))
      }.bind(this))
    }.bind(this))
    return entities
  }
, generateObject: function(name, attrs) {
    var a = _.merge(
      { name: name
      , sprite: beget(_.find(this.sprites, { name: name }))
      , __isLevelPiece: true
      , draw: drawSprite
      }
    , attrs
    )
    return a
  }
}
