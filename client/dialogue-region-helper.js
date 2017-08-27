var chain = require('mw-method-chain')
  , config = require('./config')
  , decollide = require('./apply-physics')
                  .bind(null, 0) // bind 0 as we don't want physics applied
  , maxCharWidth = config.dialogueMaxCharWidth
  , maxLines = config.dialogueMaxLines
  , formatText = require('../text-formatter')

module.exports = {
generateRegion: function(text, dontCoverBounds, viewport, options) {
  return chain(formatText(text, (options && options.maxCharWidth) || maxCharWidth))
    (generateBoundsToEngulf.bind(options))
    (centerAt.bind(null, centerDefault(dontCoverBounds)))
    (escapeCollisions.bind(null, dontCoverBounds.concat(antiViewport(viewport))))
    (escapeCollisions.bind(null, antiViewport(viewport)))
    (roundEmAll)
    .value
}
, generateBoundsToEngulf: generateBoundsToEngulf
, centerAt: centerAt
, escapeCollisions: escapeCollisions
, antiViewport: antiViewport
}

function centerDefault(dontCoverBounds) {
  return dontCoverBounds[0] ? topMiddle(dontCoverBounds[0]) : [0,0]
}

function generateBoundsToEngulf(text) {
  return [
    0
  , 0
  , config.menuBorderSize * 2 + config.textCharWidth * (
      Math.min(this.maxCharWidth || maxCharWidth, longestLine(text).length)
    )
  , config.menuBorderSize * 2 + config.textCharHeight * (
      Math.min(this.maxLines || maxLines, lines(text).length)
    )
  ]
}

function centerAt(xy, b) {
  return [
    b[0] + xy[0] - b[2]/2
  , b[1] + xy[1] - b[3]/2
  , b[2]
  , b[3]
  ]
}

function topMiddle(bounds) {
  return [bounds[0] + bounds[2]/2, bounds[1]]
}

function escapeCollisions(scene, obj) {
  var decollided = decollide(
    { x: 0, y: 0, bounds: function() { return [
        obj[0] + this.x
      , obj[1] + this.y
      , obj[2]
      , obj[3]
      ]
    }}
  , scene.map.bind(scene, generateGroundObjectFromBounds)
  )
  return decollided.bounds()
}

function generateGroundObjectFromBounds(bounds) {
  return {
    layer: 'ground'
  , bounds: function() { return bounds.map(through) }
  }
}

function antiViewport(bounds) {
  var huge = Math.pow(8, 8)
  return [
    [ -huge              ,               -huge, huge + bounds[0],           2*huge ]
  , [ -huge              ,               -huge, 2*huge          , huge + bounds[1] ]
  , [ -huge              , bounds[1]+bounds[3], 2*huge          ,             huge ]
  , [ bounds[0]+bounds[2],               -huge, huge            ,           2*huge ]
  ] // a, b, c, d

//                       inverse of bounds
//               ,-------------,   ,-------------,
//               |  ---------------------------  |
//   bounds      | |           | b |           | |
//    ---        |  ---------------------------  |
//   |   |   --> |      a      |   |     d       |
//    ---        |  ---------------------------  |
//               | |           | c |           | |
//               |  ---------------------------  |
//               '-------------'   '-------------'
}

function roundEmAll(arr) {
  return arr.map(function(num) { return Math.round(num) })
}

function through(a) { return a }

function compareLength(a, b) {
  if( a.length === b.length) return 0
  return a.length < b.length ? -1 : 1
}

function longestLine(text) {
  return lines(text).sort(compareLength).pop()
}

function lines(text) {
  return text.split('\n')
}
