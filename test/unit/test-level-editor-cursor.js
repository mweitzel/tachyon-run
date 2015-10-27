var test = require('tape')
  , Cursor = require('../../client/level-editor-cursor')
  , td = require('testdouble')
  , keys = require('../../client/keys')
  , zLayers = require('../../client/layer-z-defaults')

test('arrow keys trigger position movements', function(t) {
  t.plan(4)
  var core = coreStub()
  var c = new Cursor()
  td.when(
    core.input.getKeyDown(keys.RIGHT)
  ).thenReturn(true)

  t.equals(c.x, 0)
  c.update(core)
  t.equals(c.x, 16)

  td.when(
    core.input.getKeyDown(keys.UP)
  ).thenReturn(true)

  t.equals(c.y, 0)
  c.update(core)
  t.equals(c.y, -16)
})

test('z value is gui, so it always displays on top of game objects', function(t){
  t.plan(1)
  c = new Cursor()
  t.equals(c.z, zLayers.gui)
})

function coreStub() {
  return { input: { getKeyDown: td.create(), getKey: td.create() } }
}
