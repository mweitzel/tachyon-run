var _ = require('lodash')
  , timedRemove = require('./remove-obj-after-time')
  , conditionalRemove = require('./remove-obj-on-met-condition')
  , HudText = require('./hud-text')
  , colors = require('./colors')
  , Rstring = require('./renderable-string')
  , follow = require('./follow')
  , floatWithin = require('./float-within')
  , pad = require('./inner-pad')
  , config = require('./config')
  , collider = require('./collider')

module.exports = function(text, user, core) {
  var time = text.split(' ').length * 500
  var hudText = new HudText(text)

  _.merge(
    hudText
  , floatWithin(
      pad(
        [ 0, 0, core.context.width, core.context.height ]
      , config.tileSize
      )
    , ['middle', 'bottom']
    , hudText.rstring
    )
  )


  core.entities.push(hudText)
  timedRemove(core, hudText, time)
  var initXY = [ user.x, user.y ]
  conditionalRemove(core, hudText, function() {
    return collider.distance(initXY, [user.x, user.y]) > config.tileSize / 2
  })
}
