var test = require('tape')
  , Prompt = require('../../client/priority-prompt')
  , Core = require('../../client/core')

test('adds to core priority stack', function(t) {
  t.plan(1)
  var core = { priorityStack: [] , removePriorityObj: Core.prototype.removePriorityObj}
  var p = new Prompt(core, 'hi')
  t.equal(core.priorityStack.length, 1)
})

test('removes from stack upon submission', function(t) {
  t.plan(1)
  var core = { priorityStack: [] , removePriorityObj: Core.prototype.removePriorityObj}
  var p = new Prompt(core, 'hi')
  p.submit()
  t.equal(core.priorityStack.length, 0)
})
