var test = require('tape')
  , Core = require('../../client/core.js')
  , help = require('./core-helpers')

test('#getKeyDown only registers the frame it was pressed', function(t) {
  t.plan(3)
  var c = new Core(help.mockWindow(), help.mockCanvasContext())
    , input = c.input
    , kc = 1

  c.physicsTimeStep = 10
  c.lastUpdate = 5

  input.keyCodesDown[kc] = 3
  input.keyCodesUp[kc] = 0
  t.false(input.getKeyDown(kc), 'getKeyDown does not register on tick after downpress')

  input.keyCodesDown[kc] = 7
  t.true(input.getKeyDown(kc), 'getKeyDown registers on downpress after last input, before step is done')

  input.keyCodesDown[kc] = 17
  t.false(input.getKeyDown(kc), 'getKeyDown does not register on downpress after last input, but before step it occurs in')
})

test('#keyDown only applies if #keyUp since last #keyDown, to prevent repeattsssssssssssss', function(t) {
  t.plan(3)
  var fakePerformance = { now: function() { return this.__now } }
  var c = new Core(help.mockWindow(), help.mockCanvasContext(), fakePerformance)
    , input = c.input
    , kc = 1

  c.physicsTimeStep = 10
  c.lastUpdate = 0

  fakePerformance.__now = 1
  input.keyDown({keyCode: kc})
  fakePerformance.__now = 2
  input.keyUp(  {keyCode: kc })
  fakePerformance.__now = 3
  input.keyDown({keyCode: kc })

  t.equals(input.keyCodesUp[kc],   2, 'keyUp registers')
  t.equals(input.keyCodesDown[kc], 3, 'keyDown after keyUp registers')

  input.keyDown({keyCode: kc, timeStamp: 4 })

  t.equals(input.keyCodesDown[kc], 3, 'only first keyDown after keyUp registers')

})
