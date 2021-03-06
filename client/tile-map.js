var _ = require('lodash')

module.exports = TileMap

function TileMap(maxTileSize) {
  this.maxTileSize = maxTileSize
  this.map = {}
}

TileMap.prototype = {
  smushToKey: function(xy) {
    return [
      Math.round(xy[0]/this.maxTileSize)
    , Math.round(xy[1]/this.maxTileSize)
    ].join(',')
  }
, cache: function(object) {
    var oldKeys = object.__cachedTileKeys || []
    var newKeys = this.tileKeysFor(object)

    var addKeys = _.difference(newKeys, oldKeys)
    var removeKeys = _.difference(oldKeys, newKeys)

    object.__cachedTileKeys = newKeys

    _.forEach(
      removeKeys
    , function(key) {
        this.map[key] = this.map[key] || []
        _.remove(this.map[key], object)
      }.bind(this)
    )

    _.forEach(
      addKeys
    , function(key) {
        this.map[key] = this.map[key] || []
        this.map[key].push(object)
      }.bind(this)
    )
  }
, tileKeysFor: function(obj) {
    var bounds = obj.bounds()
    if(bounds[2] > this.maxTileSize || bounds[3] > this.maxTileSize) {
      console.error([
        'WARNING'
      , '  bounds ['+bounds.join(',')+'] exceed maxTileSize'
      , '  this may cause a serious performance hit'
      ].join('\n'))

      var keys = []
      for(var x = bounds[0]; x <= bounds[0] + bounds[2] + this.maxTileSize; x += this.maxTileSize) {
        for(var y = bounds[1]; y <= bounds[1] + bounds[3] + this.maxTileSize; y += this.maxTileSize) {
          keys.push([
            Math.min(x, bounds[0] + bounds[2])
          , Math.min(y, bounds[1] + bounds[3])
          ])
        }
      }
      return _.uniq(keys.map(this.smushToKey.bind(this)))
    }
    else {
      return _.uniq([
        this.smushToKey([bounds[0]            , bounds[1]]            )
      , this.smushToKey([bounds[0]            , bounds[1] + bounds[3]])
      , this.smushToKey([bounds[0] + bounds[2], bounds[1]]            )
      , this.smushToKey([bounds[0] + bounds[2], bounds[1] + bounds[3]])
      ])
    }
  }
, getOthersNear: function(object) {
    return _.compact(
      _.uniq(
        _.flatten(
          _.map(
            this.tileKeysFor(object)
          , function(key) { return (this.map || [])[key] }.bind(this)
          )
        )
      )
    )
  }
, removeObj: function(object) {
    if(!object.__cachedTileKeys) { return }
    _.forEach(
      object.__cachedTileKeys
    , function(key) {
        this.map[key] = this.map[key] || []
        _.remove(this.map[key], object)
      }.bind(this)
    )
    object.__cachedTileKeys = []
  }
}