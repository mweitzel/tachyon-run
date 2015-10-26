var _ = require('lodash')
  , drawSprite = require('./sprite').draw
  , savedAttrs = [
      'x'
    , 'y'
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
, serialize: function(entities) {
    var saveObject = {}

    var toSave = _.filter(entities, { __isLevelPiece: true })
    var layers = _.map(_.unique(toSave, 'layer'), 'layer')
    var objNames = _.pluck(toSave, 'name')

    _.each(layers, function(layer) {
      var layerSaveObj = {}
      _.each(objNames, function(name) {
        layerSaveObj[name] = _.chain(toSave)
          .where({ name: name, layer: layer })
          .map(this.__objToAttrArray)
          .value()
      }.bind(this))
      saveObject[layer] = layerSaveObj
    }.bind(this))

    return JSON.stringify(saveObject)
  }
, __objToAttrArray: function(obj) {
    var returnObj = []
    _.each(savedAttrs, function(attr) {
      returnObj.push(obj[attr])
    })
    return returnObj
  }
, __arrayToAttrObj: function(arr) {
    var returnObj = {}
    _.each(arr, function(attr, i) {
      returnObj[savedAttrs[i]] = attr
    })
    return returnObj
  }
, parse: function(json) {
    var entities = []
    var serialized = JSON.parse(json)
    var layers = _.keys(serialized)
    _.forEach(layers, function(layer) {
      var objNames = _.keys(serialized[layer])
      _.forEach(objNames, function(name) {
        _.forEach(serialized[layer][name], function(objAttrList) {
          var attrs = this.__arrayToAttrObj(objAttrList)
          attrs.layer = layer
          entities.push(this.generateObject(name, attrs))
        }.bind(this))
      }.bind(this))
    }.bind(this))
    return entities
  }
, generateObject: function(name, attrs) {
    var a = _.merge(
      { name: name
      , sprite: _.find(this.sprites, { name: name })
      , __isLevelPiece: true
      , draw: drawSprite
      }
    , attrs
    )
    return a
  }
}
