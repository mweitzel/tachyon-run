var test = require('tape')
    a = this
  , Core = require('../../client/core.js')
  , td = require('testdouble')
  , help = require('./core-helpers')

test('can instantiate engine instance', function(t) {
  var c = new Core(help.mockWindow())
  t.plan(2)
  t.ok(c.play)
  t.ok(c.entities)
})

test('#step calls update on each entity, core passed as arg', function(t) {
  t.plan(1)
  var core = new Core(help.mockWindow(), help.mockCanvasContext())
  var go1 = td.create(GameObject)
  var go2 = td.create(GameObject)
  core.entities.push(go1)
  core.entities.push(go2)
  core.step()
  t.doesNotThrow(function() {
    td.verify(go1.update(core))
    td.verify(go2.update(core))
  })
})

test('#update calls draw on each entity', function(t) {
  t.plan(1)
  var c = new Core(help.mockWindow(), help.mockCanvasContext())
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

test('#update does not call drawDebug when core.debug is not set', function(t) {
  t.plan(1)
  var c = new Core(help.mockWindow(), help.mockCanvasContext())

  var go = td.create(GameObject)
  c.entities.push(go)

  c.update()

  t.throws(function() {
    td.verify(go.drawDebug())
  })
})

test.only('#update calls drawDebug on each entity if core.debug is set', function(t) {
  t.plan(1)
  var c = new Core(help.mockWindow(), help.mockCanvasContext())

  var go = td.create(GameObject)
  c.entities.push(go)

  c.debug = true
  c.update()

  t.doesNotThrow(function() {
    td.verify(go.drawDebug())
  })
})


test('#start leaves game unpaused', function(t) {
  t.plan(1)
  var c = new Core(help.mockWindow(), help.mockCanvasContext())
  c.start()
  t.false(c.paused)
  c.stop()
})

test('#draw sorts entities by z axis (undefined z defaults to 0)', function(t) {
  t.plan(1)
  var c = new Core(help.mockWindow(), help.mockCanvasContext())
  c.entities = [{ z: 10 }, { z: 9 }, { z: 11 }, { z: 8 }, {}, { z:-1}]
  c.draw()
  t.deepEqual(c.entities, [{ z:-1 }, {},  { z: 8 }, { z: 9 }, { z: 10 }, { z: 11 }])
})

function GameObject() { }
GameObject.prototype.update = function() {}
GameObject.prototype.draw = function() {}
GameObject.prototype.drawDebug = function() {}
