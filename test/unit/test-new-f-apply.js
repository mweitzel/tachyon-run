var test = require('tape')
  , applyNewFunc = require('../../new-f-apply')

test('example use case', function(t) {
  t.plan(1)
  function A(a,b,c) {
    this.a = a
    this.b = b
    this.c = c
  }
  var a = applyNewFunc(A, [1,2,3])
  t.deepEqual(a, {a:1, b:2, c:3})
})
