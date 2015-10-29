var test = require('tape')
  , Inspector = require('../../client/overlay-inspector')
  , z = require('../../client/layer-z-defaults').gui

test('has gui z index', function(t) {
  t.plan(1)
  t.equal(new Inspector().z, z)
})

test('focuses on object under cursor of current layer', function(t) {
  t.plan(2)
  var cursor = { x: 20, y: 20 }
  var layerSelector = { layer: 'ground' }
  var inspector = new Inspector(cursor, layerSelector)
  core = {entities:[
    { layer: 'ground', name: 'potato', x: 20, y: 20 }
  , { layer: 'ground', name: 'tomato', x: 30, y: 20 }
  ]}

  inspector.update(core)
  t.equal(inspector.selected.name, 'potato')
  t.true(inspector.renderString.string.indexOf('potato') > -1)
})

test.only('if nothing selected, render string is blank', function(t) {
  t.plan(2)
  var cursor = { x: 20, y: 20 }
  var layerSelector = { layer: 'ground' }
  var inspector = new Inspector(cursor, layerSelector)
  core = {entities:[ ]}

  inspector.update(core)
  t.equal(inspector.selected, undefined)
  t.equal(inspector.renderString.string, '--')
})
