var test = require('tape')
  , td = require('testdouble')
  , Sprite = require('../../client/sprite')
  , CSprite = Sprite.bind(null
    , { frames: {
          "john_3.png": { frame: {} }
        , "john_1.png": { frame: {} }
        , "john_2.png": { frame: {} }
        , "john_8.png": { frame: {} }
        , "john_9.png": { frame: {} }
        , "john_10.png": { frame: {} }
        , "larry.png": { frame: { } }
        } }
    , { larry: { fps: 12345, loop: false } }
    )

test('Sprite', function(t) {
  t.plan(3)
  t.equal(typeof Sprite, 'function', 'exports as function')
  t.equal(Sprite.prototype.fps, 10, 'defaultsto 60 fps')
  t.equal(Sprite.prototype.loop, true, 'defaults to loop')
})

test('filters to sprites with passed name prefix', function(t) {
  t.plan(1)
  var s = new CSprite('john')
  t.deepEqual(
    s.frameNames
  , ['john_1', 'john_2', 'john_3', 'john_8', 'john_9', 'john_10'].map(appendPng)
  )
  function appendPng(str) { return str+'.png' }
})

test('#timeElapsed works when optional params are passed', function(t) {
  t.plan(1)
  var now = new Date().getTime()
  var s = new CSprite('john', now)
  t.equal(s.timeElapsed(now + 314), 314)
})

test('#getFrame is based off of start time and elapsed time', function(t) {
  t.plan(5)
  var now = 0
  var s = new CSprite('john', now)
  var msPerFrame = s.mspf
  t.equal(s.getFrame(0).name,          'john_1.png', 'with no elapsed time, first frame')
  t.equal(s.getFrame(s.mspf - 1).name, 'john_1.png', 'same frame until enough time elapsed')
  t.equal(s.getFrame(s.mspf).name,     'john_2.png', 'different frame once time elapses')
  t.equal(s.getFrame(s.mspf*2).name,   'john_3.png', 'different frame once time elapses')
  t.equal(s.getFrame(s.mspf*3-1).name, 'john_3.png', 'different frame once time elapses')
})

test('#getFrame rolls around only when loop is true', function(t) {
  t.plan(2)
  var s = new CSprite('john', 0)
  var fullCycleTime = s.frameNames.length * s.mspf
  s.loop = true
  t.equal(s.getFrame(fullCycleTime + 1).name, 'john_1.png', 'rolls back around if loop')
  s.loop = false
  t.equal(s.getFrame(fullCycleTime + 1).name, 'john_10.png', 'stays at end if no loop')
})

test('sprite meta data overrides default', function(t) {
  t.plan(2)
  var s = new CSprite('larry', 0)
  t.equal(s.fps, 12345)
  t.false(s.loop)
})

test('Sprite has method #draw which assumes "this" has a sprite object', function(t) {
  t.plan(1)
  var context = { drawImage: td.create() }
    , gameObject = {
        draw: Sprite.draw
      , sprite: {
          getFrame: td.create()
        , atlas: { image: td.create() }
        }
      }
    , xyhw = [1,2,3,4]
  td.when(gameObject.sprite.getFrame()).thenReturn({data: xyhw})

  gameObject.draw(context)

  t.doesNotThrow(function() {
    td.verify(context.drawImage())
  })
})
