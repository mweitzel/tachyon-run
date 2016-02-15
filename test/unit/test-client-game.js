var main = require('../../client/game-main')
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

test('invokes game with canvas context on page "/demo"', function(t) {
  t.plan(1)
  var ctx = context()
    , req = requires()
    , canvas = td.create()
  td.when(ctx.document.getElementById()).thenReturn(canvas)

  ctx.location.pathname = '/demo'
  main.call(ctx, req)

  t.doesNotThrow(function() { td.verify(req.game(canvas)) })
})

test('invokes game with canvas context on page "/"', function(t) {
  t.plan(1)
  var ctx = context()
    , req = requires()
    , canvas = td.create()
  td.when(ctx.document.getElementById()).thenReturn(canvas)

  ctx.location.pathname = '/'
  main.call(ctx, req)

  t.throws(function() { td.verify(req.game(canvas)) })
})

function context() {
  return {
    getComputedStyle: td.create()
  , addEventListener: td.create()
  , document: {
      getElementById: td.create()
    , getElementsByClassName: function() { return [ td.create() ] }
    }
  , location: { }
  }
}

function requires() {
  return {
    game: td.create()
  , fullscreen: { doubleClickToggle: function() {} }
  }
}
