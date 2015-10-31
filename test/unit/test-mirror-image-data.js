var test = require('tape')

test('can load even wthout globals defined', function(t) {
  t.plan(1)
  t.doesNotThrow(function() {
    require('../../client/mirror-image-data')
  })
})
