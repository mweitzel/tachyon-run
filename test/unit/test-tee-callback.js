var test = require('tape')
  , spy = require('../../tee-callback')

test('puts return value in array', function(t) {
  t.plan(1)
  var spyArray = []

  var spyFunc = spy(spyArray, function() { return 5 })
  spyFunc()

  t.deepEqual(spyArray, [5])
})
