var test = require('tape')
  , f = require('../../fetch-env')

test('retrieves env var on success', function(t) {
  t.plan(1)
  process.env.BANANA_CORN = 'hammerthorn'
  t.equal(f('BANANA_CORN'), 'hammerthorn')
  delete process.env.BANANA_CORN // clean up
})

test('throws error when variable not defined', function(t) {
  t.plan(1)
  t.throws(f.bind(null,'BANANA_CORN'))
})
