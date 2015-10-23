var test = require('tape')
  , Editor = require('../../client/scene-level-editor')
  , Cursor = require('../../client/level-editor-cursor')
  , td = require('testdouble')

test('adds cursor to the scene', function(t) {
  t.plan(1)

  var core = { entities: { push: td.create() } }
  var editor = new Editor(core)

  t.doesNotThrow(function() {
    td.verify(core.entities.push(td.matchers.isA(Cursor)))
  })
})
