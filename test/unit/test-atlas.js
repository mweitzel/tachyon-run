var test = require('tape')

test('depends on global Image function', function(t) {
  t.plan(2)
  t.throws(function() {
    require('../../client/atlas')
  })
  t.doesNotThrow(function() {
    Image = function() {}
    require('../../client/atlas')
    delete Image
  })
})
