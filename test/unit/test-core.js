var test = require('tape')
  , Core = require('../../client/core.js')
  , td = require('testdouble')

test('can instantiate engine instance', function(t) {
  var c = new Core(mockWindow())
  t.plan(2)
  t.ok(c.play)
  t.ok(c.entities)
})

test('#step calls update on each entity', function(t) {
  t.plan(1)
  var c = new Core(mockWindow(), mockCanvasContext())
  var go1 = td.create(GameObject)
  var go2 = td.create(GameObject)
  c.entities.push(go1)
  c.entities.push(go2)
  c.step()
  t.doesNotThrow(function() {
    td.verify(go1.update())
    td.verify(go2.update())
  })
})

test('#update calls draw on each entity', function(t) {
  t.plan(1)
  var c = new Core(mockWindow(), mockCanvasContext())
  var go1 = td.create(GameObject)
  var go2 = td.create(GameObject)
  c.entities.push(go1)
  c.entities.push(go2)
  c.update()
  t.doesNotThrow(function() {
    td.verify(go1.draw())
    td.verify(go2.draw())
  })
})

test('#start leaves game unpaused', function(t) {
  t.plan(1)
  var c = new Core(mockWindow(), mockCanvasContext())
  c.start()
  t.false(c.paused)
  c.stop()
})

test('#getKeyDown only registers the frame it was pressed', function(t) {
  t.plan(3)
  var c = new Core(mockWindow(), mockCanvasContext())
    , input = c.input
    , kc = 1

  c.physicsTimeStep = 10
  c.lastUpdate = 5

  input.keyCodesDown[kc] = 3
  input.keyCodesUp[kc] = 0
  t.false(input.getKeyDown(kc), 'getKeyDown does not register on tick after downpress')

  input.keyCodesDown[kc] = 7
  t.true(input.getKeyDown(kc), 'getKeyDown registers on downpress after last input, before step is done')

  input.keyCodesDown[kc] = 17
  t.false(input.getKeyDown(1), 'getKeyDown does not register on downpress after last input, but before step it occurs in')
})

test('#keyDown only applies if #keyUp since last #keyDown, to prevent repeattsssssssssssss', function(t) {
  t.plan(3)
  var c = new Core(mockWindow(), mockCanvasContext())
    , input = c.input
    , kc = 1

  c.physicsTimeStep = 10
  c.lastUpdate = 0

  input.keyDown({keyCode: kc, timeStamp: 1 })
  input.keyUp(  {keyCode: kc, timeStamp: 2 })
  input.keyDown({keyCode: kc, timeStamp: 3 })

  t.equals(input.keyCodesUp[kc],   2, 'keyUp registers')
  t.equals(input.keyCodesDown[kc], 3, 'keyDown after keyUp registers')

  input.keyDown({keyCode: kc, timeStamp: 4 })

  t.equals(input.keyCodesDown[kc], 2, 'only first keyDown after keyUp registers')

})



function mockWindow() {
  var w = td.create()
  w.document = td.create()
  w.document.addEventListener = td.create()
  w.requestAnimationFrame = function(cb) { setTimeout(cb, 0) }//td.create()
  return w
}

function mockCanvasContext() {
  return { clearRect: td.create() }
}

function GameObject() { }
GameObject.prototype.update = function() {}
GameObject.prototype.draw = function() {}
