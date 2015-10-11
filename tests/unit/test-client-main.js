var main = require('../../client/main')
  , test = require('tape')
  , td = require('testdouble')

test('exports as a function to so runner can run on dom ready', function(t) {
  t.plan(1)
  t.equal(typeof main, 'function')
})

test('grabs canvas element on load', function(t) {
  t.plan(1)
  var ctx = context()
  var req = requires()
  main.call(ctx, req)
  t.doesNotThrow(function() { td.verify(ctx.document.getElementById(td.matchers.isA(String))) })
})

test('invokes game with canvas context', function(t) {
  t.plan(1)
  var ctx = context()
    , req = requires()
    , canvas = td.create()
  td.when(ctx.document.getElementById()).thenReturn(canvas)

  main.call(ctx, req)

  t.doesNotThrow(function() { td.verify(req.game(canvas)) })
})

function context() {
  return {
    document: {
      getElementById: td.create()
    }
  }
}

function requires() {
  return {
    game: td.create()
  }
}
