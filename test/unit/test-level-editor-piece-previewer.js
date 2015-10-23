var Previewer = require('../../client/level-editor-piece-previewer')
  , test = require('tape')

test('you can pop a filter letter', function(t) {
  t.plan(1)
  var prev = new Previewer()
  prev.filter = 'asdf'
  prev.popFilterLetter()
  t.equal(prev.filter, 'asd')
})

test('active returns current sprite', function(t) {
  t.plan(3)
  var sprites = ['a','b','c','d']
  var preview = new Previewer(sprites)
  t.equal(preview.active, 'a')
  preview.previous()
  t.equal(preview.active, 'd')
  preview.previous()
  preview.previous()
  preview.next()
  t.equal(preview.active, 'c')
})

test('can follow object with x and y', function(t) {
  t.plan(4)
  var preview = new Previewer()
  var cameraCenter = { x: 20, y: 30 }
  var offsetX = 100
  var offsetY = 200

  preview.follow(cameraCenter, offsetX, offsetY)

  t.equal(preview.x, 120)
  t.equal(preview.y, 230)

  cameraCenter.x = 500
  cameraCenter.y = 300

  t.equal(preview.x, 600)
  t.equal(preview.y, 500)
})
