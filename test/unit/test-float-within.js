var test = require('tape')
  , float = require('../../client/float-within')

test('float top works as expected', function(t) {
  t.plan(1)
  var obj = boundsToObj(0,0,10,10)
  var bounds = [-10, -10, 20, 20]
  t.deepEqual(float(bounds, ['top'], obj), {y: -10})
})

test('bottom buffers the height of the passed object and y and height of bounds', function(t) {
  t.plan(1)
  var obj = boundsToObj(0,0,5,5)
  var bounds = [-20, -20, 40, 40]
  t.deepEqual(float(bounds, ['bottom'], obj), {y: 15})
})

test('left just takes bounds x', function(t) {
  t.plan(1)
  var obj = boundsToObj(0,0,5,5)
  var bounds = [-20, -20, 40, 40]
  t.deepEqual(float(bounds, ['left'], obj), {x: -20})
})

test('right buffers the width of the passed object and x and width of bounds', function(t) {
  t.plan(1)
  var obj = boundsToObj(0,0,5,5)
  var bounds = [-20, -20, 40, 40]
  t.deepEqual(float(bounds, ['right'], obj), {x: 15})
})

test('v-middle offsets the vertical center of the object to vertical center of the bounds', function(t) {
  t.plan(1)
  var obj = boundsToObj(0,0,20,20)
  var bounds = [0, 100, 0, 100]
  t.deepEqual(float(bounds, ['v-middle'], obj), {y: 140})
})

test('h-middle offsets the horizontal center of the object to horizontal center of bounds', function(t) {
  t.plan(1)
  var obj = boundsToObj(0,0,20,20)
  var bounds = [200, 0, 100, 0]
  t.deepEqual(float(bounds, ['h-middle'], obj), {x: 240})
})

test('when two directions are passed, both values are returned', function(t) {
  t.plan(1)
  var obj = boundsToObj(0,0,20,20)
  var bounds = [-30, -30, 100, 100]
  t.deepEqual(float(bounds, ['top', 'left'], obj), {x: -30, y: -30})
})

test('h-middle is h-center and v-middle is v-center', function(t) {
  t.plan(2)
  t.equal(float.waysToFloat['h-center'], float.waysToFloat['h-middle'])
  t.equal(float.waysToFloat['v-center'], float.waysToFloat['v-middle'])
})
// hmid and hcenter are same

function boundsToObj(x,y,w,h) {
  return { x: x,  y: y, width: w, height: h }
}

function objToBounds(obj) {
  return [obj.x, obj.y, obj.width, obj.height]
}
