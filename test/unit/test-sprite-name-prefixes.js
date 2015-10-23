var test = require('tape')
  , getPrefixes = require('../../client/sprite-name-prefixes')

test('grabs potential sprites based off naming convention', function(t) {
  t.plan(1)
  var allSpriteFrameNames = [
    'johnny_0.png'
  , 'johnny_1.png'
  , 'block_a.png'
  , 'weird_thing_a_0.png'
  , 'weird_thing_a_1.png'
  , 'betsy.png'
  ]
  t.deepEqual(
    getPrefixes(allSpriteFrameNames)
  , [ 'johnny'
    , 'block_a'
    , 'weird_thing_a'
    , 'betsy'
    ]
  )
})
