var genBounds = require('./generate-encapsulating-bound')
  , follow = require('./smooth-camera-follow')
  , _ = require('lodash')

module.exports = function(core, player) {
  var groundBounds = _.map(
      _.filter(core.entities, {layer:'ground'})
    , function(o) { return o.bounds() }
    )
  var bounds = genBounds(groundBounds)

  core.cameraCenter.follow = function(obj, offsetX, offsetY) {
    follow.call(core.cameraCenter, obj, offsetX, offsetY, bounds, core.cameraSize)
  }

  core.cameraCenter.follow(player, 0, -(player.height))
}
