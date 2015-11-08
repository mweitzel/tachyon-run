var test = require('tape')
  , Background = require('../../client/background')

test('appropriate #draw is used for different types of strings', function(t) {
  t.plan(2)
  var b = new Background('#303')
  t.equal(b.draw, Background.drawColor)
  var b = new Background('background_a')
  t.equal(b.draw, Background.drawTiledImage)
})

test('creates sprite from string and tiles it')
