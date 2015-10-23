var test = require('tape')
  , Cursor = require('../../client/level-editor-cursor')
  , td = require('testdouble')
  , keys = require('../../client/keys')

test('arrow keys trigger position movements', function(t) {
  t.plan(4)
  var core = coreStub()
  var c = new Cursor(core)
  td.when(
    core.input.getKeyDown(keys.RIGHT)
  ).thenReturn(true)

  t.equals(c.x, 0)
  c.update()
  t.equals(c.x, 16)

  td.when(
    core.input.getKeyDown(keys.UP)
  ).thenReturn(true)

  t.equals(c.y, 0)
  c.update()
  t.equals(c.y, -16)
})

test('when position changes, so does core.cameraCenter', function(t) {
  t.plan(1)
  var core = coreStub()
  c = new Cursor(core)
  c.x = 20
  c.y = 43
  t.deepEquals(core.cameraCenter, { x: 20, y: 43 })
})

function coreStub() {
  return { input: { getKeyDown: td.create() }, cameraCenter: {} }
}
