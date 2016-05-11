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
    , req = requires()
    , canvas = stubCanvas()
  td.when(ctx.document.getElementById()).thenReturn(canvas)

  ctx.location.pathname = '/demo'
  main.call(ctx, req)
  t.doesNotThrow(function() { td.verify(ctx.document.getElementById(td.matchers.isA(String))) })
})

test('invokes game with canvas context on page "/demo"', function(t) {
  t.plan(1)
  var ctx = context()
    , req = requires()
    , canvas = stubCanvas()
  td.when(ctx.document.getElementById()).thenReturn(canvas)

  ctx.location.pathname = '/demo'
  main.call(ctx, req)

  t.doesNotThrow(function() { td.verify(req.game(canvas)) })
})

test('does not invoke game with canvas context on page "/demo" if not browser compatible', function(t) {
  t.plan(1)
  var ctx = context()
    , req = requires()
    , canvas = stubCanvas()
  td.when(ctx.document.getElementById()).thenReturn(canvas)

  ctx.chrome = null

  ctx.location.pathname = '/demo'
  main.call(ctx, req)

  t.throws(function() { td.verify(req.game(canvas)) })
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

function stubCanvas() {
  var c = td.create()
  c.classList = { add: td.create(), remove: td.create() }
  return c
}

function context() {
  return {
    getComputedStyle: td.create()
  , addEventListener: td.create()
  , chrome: { webstore: 'heck yea' }
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
