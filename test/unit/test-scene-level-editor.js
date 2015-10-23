var test = require('tape')
  , Editor = require('../../client/scene-level-editor')
  , Cursor = require('../../client/level-editor-cursor')
  , Previewer = require('../../client/level-editor-piece-previewer')
  , td = require('testdouble')

test('adds cursor to the scene', function(t) {
  t.plan(1)

  var core = { entities: { push: td.create() }, cameraSize: { x:10, y:10 } }
  var editor = new Editor(core)

  t.doesNotThrow(function() {
    td.verify(core.entities.push(td.matchers.isA(Cursor)))
  })
})

test('adds piece previewer to the scene', function(t) {
  t.plan(1)

  var core = { entities: { push: td.create() }, cameraSize: { x:10, y:10 } }
  var editor = new Editor(core)

  t.doesNotThrow(function() {
    td.verify(core.entities.push(td.matchers.isA(Previewer)))
  })
})
