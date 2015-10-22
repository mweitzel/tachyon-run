var test = require('tape')

test('depends on global Image function', function(t) {
  t.plan(2)
  t.doesNotThrow(function() {
    Image = function() {}
    var client = require('../../client/atlas')
    delete Image
    t.ok(client.image.isTestHelper)
  })
})
