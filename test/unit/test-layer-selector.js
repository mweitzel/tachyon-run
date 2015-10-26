var LayerSelector = require('../../client/layer-selector')
  , test = require('tape')

test('can create a selector from an array and it clones it', function(t) {
  t.plan(2)
  var original = ['1','2','3','4','5']
  var selector = new LayerSelector(original)
  t.notEqual(original, selector.layers)
  t.deepEqual(original, selector.layers)
})

test('can cycle through layers with #nextLayer', function(t) {
  t.plan(3)
  var layers = ['first', 'second', 'third']
  var selector = new LayerSelector(layers)
  t.equal(selector.layer, 'first')
  selector.nextLayer()
  t.equal(selector.layer, 'second')
  selector.nextLayer()
  selector.nextLayer()
  t.equal(selector.layer, 'first')
})

test('has a render string which takes its draw calls')
test('defers height to renderString')
