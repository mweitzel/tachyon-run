var test = require('tape')
  , Core = require('../../client/core.js')
  , Cursor = require('../../client/level-editor-cursor')
  , help = require('./core-helpers')
  , td = require('testdouble')

test('core has a centerable camera on which draws are based', function(t){
  t.plan(3)
  var ctx = help.mockCanvasContext()
  var c = new Core(help.mockWindow(), ctx)
  t.deepEqual(c.cameraSize,   { x: 384, y: 216 })
  t.deepEqual(c.cameraCenter, { x: 0,   y: 0 })
  t.doesNotThrow(function() {
    c.draw()
    td.verify(ctx.setTransform(1,0,0,1, 192, 108))
  })
})

test('core has a centerable camera on which draws are based, even if moved', function(t){
  t.plan(3)
  var ctx = help.mockCanvasContext()
  var c = new Core(help.mockWindow(), ctx)
  t.deepEqual(c.cameraSize,   { x: 384, y: 216 })
  t.deepEqual(c.cameraCenter, { x: 0,   y: 0 })
  t.doesNotThrow(function() {
    c.cameraCenter = { x: 1000, y: 1000 }
    c.draw()
    td.verify(ctx.setTransform(1,0,0,1, 1000+192, 1000+108))
  })
})
