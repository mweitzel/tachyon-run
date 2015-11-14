var test = require('tape')
  , timedRemove = require('../../client/remove-obj-after-time')
  , Core = require('../../client/core')
  , cHelp = require('./core-helpers')

test('removes specified object after specified time', function(t) {
  t.plan(2)
  var c = new Core(cHelp.mockWindow(), cHelp.mockCanvasContext)
  var exampleObj = { hello: 'hi' }
  var objToStay = { hello: 'banana' }
  c.entities.push(exampleObj)
  c.entities.push(objToStay)

  c.lastUpdate = 100
  c.physicsTimeStep = 50
  var r = timedRemove(c, exampleObj, 25)

  c.step()
  t.deepEqual(c.entities, [exampleObj, objToStay, r])
  c.step()
  t.deepEqual(c.entities, [objToStay])
})
