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

test('z value is 1000, so it always displays on top', function(t){
  t.plan(1)
  c = new Previewer()
  t.equals(c.z, 1000)
})
