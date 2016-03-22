var test = require('tape')
  , chain = require('../../transform-chain')
  , plus = function(a, b) { return a + b }
  , times = function(a, b) { return a * b }

test('chain(val).value returns value', function(t) {
  t.equals(
    chain(5).value
  , 5
  )
  t.end()
})

test('chaining values with transform functions ', function(t) {
  t.equals(
    chain(5)
      (partial(plus,  5))
      (partial(times, 10))
      (partial(plus,  37))
      (partial(times, -14))
      (partial(plus,  1919))
      .value
  , 1
  )
  t.end()
})

test('accepts function in initial chain call', function(t) {
  var plus = function(a, b) { return a + b }
  t.equals(
    chain(5, partial(plus,  10))
      (partial(plus,  5))
      .value
  , 20
  )
  t.end()
})

function partial(f, v) { return f.bind(f, v) }
