var test = require('tape')
  , Loader = require('../../client/scene-loader')

test('camera center is redefined on load', function(t) {
  t.plan(2)
  var core = coreStub()
  var loader = new Loader(core)
  var initialCamera = core.cameraCenter
  t.equal(initialCamera, core.cameraCenter)
  loader.__prepCoreForNewScene()
  t.notEqual(initialCamera, core.cameraCenter)
})

function coreStub() {
  return {
    entities: []
  , cameraCenter: { x: 0, y: 0 }
  , play: function() {}
  , pause: function() {}
  }
}
