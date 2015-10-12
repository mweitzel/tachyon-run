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
