var test = require('tape')
  , td = require('testdouble')
  , Core = require('../../client/core')

test('if non empty, only priority stack will recieve update calls', function(t) {
  t.plan(2)
  var core = new Core({document:{addEventListener:function(){}}})
  var gameObj = { update: td.create() }
  var priorityObj = { update: td.create() }
  core.priorityStack.push(priorityObj)
  core.entities.push(priorityObj)

  core.step()

  t.throws(function() {
    td.verify(gameObj.update(core))
  })
  t.doesNotThrow(function() {
    td.verify(priorityObj.update(core))
  })
})

test('if multiple, only top of is called', function(t) {
  t.plan(2)
  var core = new Core({document:{addEventListener:function(){}}})
  var priorityObj1 = { update: td.create() }
  var priorityObj2 = { update: td.create() }

  core.priorityStack.push(priorityObj1)
  core.priorityStack.push(priorityObj2)

  core.step()

  t.throws(function() {
    td.verify(priorityObj1.update(core))
  })
  t.doesNotThrow(function() {
    td.verify(priorityObj2.update(core))
  })
})
