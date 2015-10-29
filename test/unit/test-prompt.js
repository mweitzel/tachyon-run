var test = require('tape')
  , Prompt = require('../../client/prompt')
  , zIndex = require('../../client/layer-z-defaults').prompt
  , keys = require('../../client/keys')

test('is prompt level z index', function(t) {
  t.plan(1)
  t.equal(new Prompt().z, zIndex)
})

test('submit calls submit callback with current text', function(t) {
  t.plan(1)
  var prompt = new Prompt('whats up?', function(text){
    t.equal(text, 'nm')
  })
  prompt.enteredText = 'nm'
  prompt.submit()
})

test('submit calls cancel callback when cancelled', function(t) {
  t.plan(1)
  var prompt = new Prompt('whats up?', function(){}, function(){
    t.pass()
  })
  prompt.enteredText = 'nm'
  prompt.cancel()
})

test('pressing keys adds to the entered text', function(t) {
  t.plan(1)
  var prompt = new Prompt('sup?')
  var core = {
    // mashed keys in browser and collected timestamps
    input: { keyCodesDown: { 63: 0 , 64: 0 , 65: 1445967716203 , 66: 0 , 67: 1445967716495 , 68: 1445967716383 , 69: 0 , 70: 0 , 71: 0 , 72: 0 , 73: 0 , 74: 1445967716039 , 75: 1445967715999 , 76: 1445967716190 , 77: 0 , 78: 1445967716106 , 79: 1445967716490 , 80: 0 , 81: 0 , 82: 0 , 83: 1445967716263 , 84: 0 , 85: 0
    }, getKeyDown: function() {return false}, getKey: function() {}}
  , lastUpdate: 1445967716203 - 100
  , physicsTimeStep: 200
  }
  prompt.update(core)
  t.equal(prompt.enteredText, 'nlas')
})

test('enter triggers submit', function(t) {
  t.plan(1)
  var prompt = new Prompt('whats up?', t.pass.bind(t), t.fail.bind(t))
  var core = stubCore()
  core.input.getKeyDown = function(keyCode) { if(keyCode == keys.ENTER) return true }
  prompt.update(core)
})

test('escape triggets cancel', function(t) {
  t.plan(1)
  var prompt = new Prompt('whats up?', t.fail.bind(t), t.pass.bind(t))
  var core = stubCore()
  core.input.getKeyDown = function(keyCode) { if(keyCode == keys.ESCAPE) return true }
  prompt.update(core)
})

function stubCore() {
  return { input: { getKeyDown: function() { }}}
}
